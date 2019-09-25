let collection = collectionName => global.connection.collection(collectionName);

export class MongoCollection {

    constructor(collectionName) {
        this.collectionName = collectionName;
    }

    async insert(document) {
        return await collection(this.collectionName).insertOne(document);
    }

    async findAll() {
        return await collection(this.collectionName).find({}).toArray();
    }

    async findOne(document) {
        return await collection(this.collectionName).findOne(document);
    }

    async find(document) {
        return await collection(this.collectionName).find(document).toArray();
    }

    async update(id, document) {
        return await collection(this.collectionName).update(id, document);
    }

    async deleteOne(id) {
        return await collection(this.collectionName).deleteOne(id);
    }
}
