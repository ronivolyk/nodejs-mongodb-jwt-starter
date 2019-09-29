import express from 'express';
import { ObjectId } from 'mongodb';
import { PeopleCollection } from './PeopleCollection';

let peopleCollection = new PeopleCollection();

const router = express.Router();

router.get('/people', (req, res, next) => {
    peopleCollection.find(req.query)
        .then(data => {
            res.write(`Quantidade: ${data.length} \n ${JSON.stringify(data)}`);
            next();
        })
        .catch(err => next(err));
})

router.get('/people/:id', (req, res) => {
    let id = { _id: new ObjectId(req.params.id) };
    peopleCollection.findOne(id).then(data => res.end(`Encontrou ${JSON.stringify(data)}`));
})

router.post('/people', (req, res) => {
    peopleCollection.insertOne(req.body).then(data => res.end(`Inseriu ${JSON.stringify(data.ops)}`));
})

router.put('/people/:id', (req, res) => {
    peopleCollection.updateOne({ _id: new ObjectId(req.params.id) }, req.body).then(data => res.end(`Atualizou ${JSON.stringify(data)}`));
})

router.delete('/people/:id', (req, res) => {
    peopleCollection.deleteOne({ _id: new ObjectId(req.params.id) }).then(data => res.end(`Removeu ${JSON.stringify(data)}`));
})

export default router;