import express from 'express';
import * as service from './UsersService'

const router = express.Router();
const ROUTER_NAME = '/users';

router.route(ROUTER_NAME)
    .get((req, res, next) => {
        req.handler = service.find(req.query);
        next();
    })
    .post((req, res, next) => {
        req.handler = service.insert(req.body);
        next();
    })

router.route(`${ROUTER_NAME}/:id`)
    .get((req, res, next) => {
        req.handler = service.findById(req.params.id);
        next();
    })
    .put((req, res, next) => {
        req.handler = service.updateById(req.params.id, req.body);
        next();
    })
    .delete((req, res, next) => {
        req.handler = service.deleteById(req.params.id);
        next();
    })

export default router;