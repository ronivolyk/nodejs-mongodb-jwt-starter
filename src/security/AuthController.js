import express from 'express';
import * as service from './AuthService';

const router = express.Router();

router.post('/login', (req, res, next) => {
    req.handler = service.tryLogin(req.body);
    req.isLogin = true;
    next();
})

router.use((req, res, next) => {
    if (req.isLogin) {
        return next();
    }

    try {
        req.auth = service.readToken(req.headers);
        return next();
    } catch (e) {
        return next(e);
    }
});

router.use((err, req, res, next) => {
    let statusCode = 401;

    console.log(`${new Date()} - Not authenticated request: { method: ${req.method}, url: ${req.url}, statusCode: ${statusCode}, error: ${err} }`);

    res.status(statusCode).send({ error: `${err.name}: ${err.message}` });
})

export default router;