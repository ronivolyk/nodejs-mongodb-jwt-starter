import { MongoClient as mongo } from 'mongodb';

const URI = 'mongodb://127.0.0.1:27017';
const OPTIONS = { useNewUrlParser: true, useUnifiedTopology: true, poolSize: 10 };
let connection;

export class Mongo {

    async connect() {
        connection = await mongo.connect(URI, OPTIONS);
    }

    getDatabase() {
        console.log('db test', connection.getDatabase('test'));
    };
}
