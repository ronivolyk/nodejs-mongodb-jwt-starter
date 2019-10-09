let collection = collectionName => global.connection.collection(collectionName);

let mongoCollection = (collectionName) => {
    return {
        find: async (document, projection) => await collection(collectionName).find(document, { projection }).toArray(),
        findOne: async (document, projection) => await collection(collectionName).findOne(document, { projection }),
        insertOne: async (document) => await collection(collectionName).insertOne(document),
        updateOne: async (id, document) => await collection(collectionName).updateOne(id, { $set: document }),
        deleteOne: async (id) => await collection(collectionName).deleteOne(id)
    }
};

export default mongoCollection;