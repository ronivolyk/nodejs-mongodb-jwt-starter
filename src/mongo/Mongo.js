import { MongoClient } from 'mongodb';

const URI = 'mongodb://127.0.0.1:27017';
const DATABASE = 'myDatabase';

const OPTIONS = { useNewUrlParser: true, useUnifiedTopology: true, poolSize: 10 };

export async function connect() {
    console.log(`Connecting to MongoDB at ${URI}`)
    let connection = await MongoClient.connect(URI, OPTIONS)
    global.connection = connection.db(DATABASE);
    console.log('MongoDB connected');
}
