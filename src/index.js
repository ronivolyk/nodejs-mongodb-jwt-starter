import http from 'http';
import { connect } from './mongo/Mongo';
import { insertPerson, findAllPeople, findPerson, searchPerson } from './mongo/PeopleCollection';

const PORT = 8080;

connect().then(() => startServer(), error => finishWithError(error));

function startServer() {
    http.createServer((req, res) => {
        console.log(`request url: ${req.url}`);

        res.writeHead(200, {'Content-type': 'text/plain'});

        if (req.url === '/') {
            res.end('Hello World');
        } else if (req.url === '/list') {
            findAllPeople().then(data => res.end(`Quantidade: ${data.length} \n ${JSON.stringify(data)}`));
        } else if (req.url.startsWith('/insert/')) {
            let person = {nome: req.url.replace('/insert/', '')};
            insertPerson(person).then(data => res.end(`Inseriu ${JSON.stringify(data.ops)}`));
        } else if (req.url.startsWith('/find/')) {
            let person = {nome: req.url.replace('/find/', '')};
            findPerson(person).then(data => res.end(`Encontrou ${JSON.stringify(data)}`));
        } else if (req.url.startsWith('/search/')) {
            let person = {nome: req.url.replace('/search/', '')};
            searchPerson(person).then(data => res.end(`Encontrou ${JSON.stringify(data)}`));
        }
    }).listen(PORT);

    console.log(`Server listening to port ${PORT}`)
}

function finishWithError(error) {
    console.error('Error', error);
    process.exit(1);
}