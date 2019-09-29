let collection = collectionName => global.connection.collection(collectionName);

export class MongoCollection {

    constructor(collectionName) {
        this.collectionName = collectionName;
    }

    async find(document) {
        return await collection(this.collectionName).find(document).toArray();
    }

    async findOne(document) {
        return await collection(this.collectionName).findOne(document);
    }

    async insertOne(document) {
        return await collection(this.collectionName).insertOne(document);
    }

    async updateOne(id, document) {
        return await collection(this.collectionName).updateOne(id, { $set: document });
    }

    async deleteOne(id) {
        return await collection(this.collectionName).deleteOne(id);
    }
}
