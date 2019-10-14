import express from 'express';
import * as service from './PeopleService';

const CONTROLLER_NAME = '/people';

let router = express.Router();

router.route(CONTROLLER_NAME)
    .get((req, res, next) => {
        req.handler = service.find(req.query);
        next();
    })
    .post((req, res, next) => {
        req.handler = service.insert(req.body);
        next();
    })

router.route(`${CONTROLLER_NAME}/:id`)
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