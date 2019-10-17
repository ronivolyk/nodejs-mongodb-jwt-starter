import express from 'express';

const router = express.Router();

router.use(async (req, res, next) => {
    try {
        req.result = await req.handler;
        next();
    } catch (e) {
        next(e);
    }
})

router.use((req, res, next) => {
    let statusCode = 200;

    if (req.result && req.result.statusCode) {
        statusCode = req.result.statusCode;
    }

    console.log(`${new Date()} - End request: { method: ${req.method}, url: ${req.url}, statusCode: ${statusCode} }`);

    res.status(statusCode);

    if (req.result) res.send(req.result);
    else res.end();
})

router.use((err, req, res, next) => {
    let statusCode = 500;

    console.log(`${new Date()} - Error request: { method: ${req.method}, url: ${req.url}, statusCode: ${statusCode}, error: ${err} }`);
    console.log(`Error: ${err.stack}`);

    res.status(statusCode).send({ error: `${err.name}: ${err.message}` });
})

export default router;