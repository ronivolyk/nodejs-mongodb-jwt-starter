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
    console.log(`${new Date()} - End request: { method: ${req.method}, url: ${req.url}, body: ${JSON.stringify(req.body)} }`);

    if (req.result) res.send(req.result);
    else res.end();
})

router.use((err, req, res, next) => {
    console.log(`${new Date()} - Error request: { method: ${req.method}, url: ${req.url}, body: ${JSON.stringify(req.body)}, error: ${err} }`);
    console.log(`Error: ${err.stack}`);
    res.status(500).send({ error: `${err.name}: ${err.message}` });
})

export default router;