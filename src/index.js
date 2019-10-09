import express from 'express';
import { connect as connectMongo } from './mongo/Mongo';
import usersRouter from './users/UsersRouter';
import peopleRouter from './people/PeopleRouter';

const PORT = 8080;

const app = express();

app.use(express.json());

app.use('/', (req, res, next) => {
    console.log(`${new Date()} - New request: { method: ${req.method}, url: ${req.url}, body: ${JSON.stringify(req.body)} }`);
    next();
})

app.use(usersRouter);
app.use(peopleRouter);

app.use('/', (req, res, next) => {
    console.log(`${new Date()} - End request: { method: ${req.method}, url: ${req.url}, body: ${JSON.stringify(req.body)} }`);

    if (res.result) res.send(res.result);
    else res.end();
})

app.use('/', (err, req, res, next) => {
    console.log(`${new Date()} - Error request: { method: ${req.method}, url: ${req.url}, body: ${JSON.stringify(req.body)}, error: ${err} }`);
    res.status(500).send(`Error: ${err}`);
})

connectMongo().then(() => startServer(), error => finishWithError(error));

function startServer() {
    app.listen(PORT, () => console.log(`Server listening to port ${PORT}`));
}

function finishWithError(error) {
    console.error('Error', error);
    process.exit(1);
}