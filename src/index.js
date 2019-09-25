import http from 'http';
import { ObjectId } from 'mongodb';
import { connect } from './mongo/Mongo';
import { PeopleCollection } from './mongo/PeopleCollection';

const PORT = 8080;

connect().then(() => startServer(), error => finishWithError(error));

function startServer() {
    http.createServer((req, res) => {
        console.log(`request url: ${req.url}`);

        res.writeHead(200, {'Content-type': 'text/plain'});

        let peopleCollection = new PeopleCollection();

        if (req.url === '/') {
            res.end('Hello World');
        } else if (req.url === '/list') {
            peopleCollection.findAll().then(data => res.end(`Quantidade: ${data.length} \n ${JSON.stringify(data)}`));
        } else if (req.url.startsWith('/insert/')) {
            let person = { nome: req.url.replace('/insert/', '') };
            peopleCollection.insert(person).then(data => res.end(`Inseriu ${JSON.stringify(data.ops)}`));
        } else if (req.url.startsWith('/find/')) {
            let person = { nome: req.url.replace('/find/', '') };
            peopleCollection.findOne(person).then(data => res.end(`Encontrou ${JSON.stringify(data)}`));
        } else if (req.url.startsWith('/search/')) {
            let person = { nome: req.url.replace('/search/', '') };
            peopleCollection.find(person).then(data => res.end(`Encontrou ${JSON.stringify(data)}`));
        } else if (req.url.startsWith('/update/')) {
            let id = { _id: new ObjectId(req.url.replace('/update/', '').split('/')[0]) };
            let person = { nome: req.url.replace('/update/', '').replace(id._id + '/', '') };
            peopleCollection.update(id, person).then(data => res.end(`Atualizou ${JSON.stringify(data)}`));
        } else if (req.url.startsWith('/delete/')) {
            let id = { _id: new ObjectId(req.url.replace('/delete/', '')) };
            peopleCollection.deleteOne(id).then(data => res.end(`Removeu ${JSON.stringify(data)}`));
        }
    }).listen(PORT);

    console.log(`Server listening to port ${PORT}`)
}

function finishWithError(error) {
    console.error('Error', error);
    process.exit(1);
}