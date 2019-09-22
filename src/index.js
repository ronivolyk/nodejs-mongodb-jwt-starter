import http from 'http';
import { Mongo } from './Mongo';

const PORT = 8080;

let mongo = new Mongo();
mongo.connect().then(() => startServer(), error => finishWithError(error));

function startServer() {
    http.createServer((req, res) => {
        console.log(`request url: ${req.url}`);
        res.writeHead(200, {'Content-type': 'text/plain'});
        res.end('Hello World');
    }).listen(PORT);

    console.log(`Server listening to port ${PORT}`)
}

function finishWithError(error) {
    console.error('Error', error);
    process.exit(1);
}