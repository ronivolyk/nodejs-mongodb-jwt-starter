import express from 'express';

const router = express.Router();

router.use((req, res, next) => {
    console.log(`${new Date()} - New request: { method: ${req.method}, url: ${req.url} }`);
    next();
})

export default router;