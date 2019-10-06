import express from 'express';
import { ObjectId } from 'mongodb';
import peopleCollection from './PeopleCollection';

const router = express.Router();
const ROUTER_NAME = '/people';

router.route(ROUTER_NAME)
    .get((req, res, next) => {
        peopleCollection.find(req.query)
            .then(data => {
                res.result = { msg: `${data.length} ${data.length === 1 ? 'person' : 'people'} found`, data: data };
                next();
            })
            .catch(err => next(err));
    })
    .post((req, res, next) => {
        peopleCollection.insertOne(req.body)
            .then(data => {
                res.result = { msg: `${req.body._id} inserted`, data: data };
                next();
            })
            .catch(err => next(err));
    })

router.route(`${ROUTER_NAME}/:id`)
    .all((req, res, next) => {
        peopleCollection.findOne({ _id: new ObjectId(req.params.id) })
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

        peopleCollection.updateOne({ _id: new ObjectId(req.params.id) }, req.body)
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

        peopleCollection.deleteOne({ _id: new ObjectId(req.params.id) })
        .then(data => {
            res.result = { msg: `${req.params.id} deleted`, data: data};
            next();
        })
        .catch(err => next(err));
    })

export default router;