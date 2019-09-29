import express from 'express';
import { ObjectId } from 'mongodb';
import { connect as connectMongo } from './mongo/Mongo';
import { PeopleCollection } from './mongo/PeopleCollection';

const PORT = 8080;

let peopleCollection = new PeopleCollection();

const app = express();
app.use(express.json());

app.use('/', (req, res, next) => {
    console.log(`${new Date()} - New request: { method: ${req.method}, url: ${req.url}, body: ${JSON.stringify(req.body)} }`);
    next();
})

app.get('/people', (req, res, next) => {
    peopleCollection.find(req.query)
        .then(data => {
            res.write(`Quantidade: ${data.length} \n ${JSON.stringify(data)}`);
            next();
        })
        .catch(err => next(err));
})

app.get('/people/:id', (req, res) => {
    let id = { _id: new ObjectId(req.params.id) };
    peopleCollection.findOne(id).then(data => res.end(`Encontrou ${JSON.stringify(data)}`));
})

app.post('/people', (req, res) => {
    peopleCollection.insertOne(req.body).then(data => res.end(`Inseriu ${JSON.stringify(data.ops)}`));
})

app.put('/people/:id', (req, res) => {
    peopleCollection.updateOne({ _id: new ObjectId(req.params.id) }, req.body).then(data => res.end(`Atualizou ${JSON.stringify(data)}`));
})

app.delete('/people/:id', (req, res) => {
    peopleCollection.deleteOne({ _id: new ObjectId(req.params.id) }).then(data => res.end(`Removeu ${JSON.stringify(data)}`));
})

app.use('/', (req, res, next) => {
    console.log(`${new Date()} - Finish request: { method: ${req.method}, url: ${req.url}, body: ${JSON.stringify(req.body)} }`);
    res.end();
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