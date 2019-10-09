import express from 'express';
import { ObjectId } from 'mongodb';
import usersCollection from './UsersCollection';
import * as Crypto from '../security/Crypto';

const router = express.Router();
const ROUTER_NAME = '/users';
const PROJECTION = { password: 0 };

router.route(ROUTER_NAME)
    .get((req, res, next) => {
        usersCollection.find(req.query, PROJECTION)
            .then(data => {
                res.result = { msg: `${data.length} ${data.length === 1 ? 'user' : 'users'} found`, data: data };
                next();
            })
            .catch(err => next(err));
    })
    .post((req, res, next) => {
        usersCollection.findOne({ email: req.body.email })
            .then(data => {
                if (!data) {
                    usersCollection.findOne({ username: req.body.username })
                    .then(data => {
                        if (!data) {
                            Crypto.getHash(req.body.password).then(hash => {
                                let user = {
                                    name: req.body.name,
                                    email: req.body.email,
                                    username: req.body.username,
                                    password: hash
                                };
                        
                                usersCollection.insertOne(user)
                                .then(data => {
                                    res.result = { msg: `${user._id} inserted`, data: data };
                                    next();
                                })
                                .catch(err => next(err));
                            });
                        } else {
                            res.result = { msg: `Username ${req.body.username} is already registered` };
                            next();                
                        }
                    })
                    .catch(err => next(err));
                } else {
                    res.result = { msg: `E-mail ${req.body.email} is already registered` };
                    next();        
                }
            })
            .catch(err => next(err));
    })

router.route(`${ROUTER_NAME}/:id`)
    .all((req, res, next) => {
        usersCollection.findOne({ _id: new ObjectId(req.params.id) }, PROJECTION)
            .then(data => {
                req.document = data;
                next();
            })
            .catch(err => next(err));
    })
    .get((req, res, next) => {
        res.result = { msg: `${req.params.id} ${req.document ? 'found' : 'not found'}`, data: req.document };
        next();
    })
    .put((req, res, next) => {
        if (!req.document) {
            res.result = { msg: `${req.params.id} not found` };
            next();
        }

        let user = {
            name: (req.body.name) ? req.body.name : req.document.name,
            email: (req.body.email) ? req.body.email : req.document.email
        };

        usersCollection.updateOne({ _id: new ObjectId(req.params.id) }, user)
        .then(data => {
            res.result = { msg: `${req.params.id} updated`, data: data};
            next();
        })
        .catch(err => next(err));
    })
    .delete((req, res, next) => {
        if (!req.document) {
            res.result = { msg: `${req.params.id} not found` };
            next();
        }

        let user = { deactivated: true }

        usersCollection.updateOne({ _id: new ObjectId(req.params.id) }, user)
        .then(data => {
            res.result = { msg: `${req.params.id} deactivated`, data: data};
            next();
        })
        .catch(err => next(err));
    })

export default router;