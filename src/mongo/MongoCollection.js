let collection = collectionName => global.connection.collection(collectionName);

export async function insert(collectionName, document) {
    return await collection(collectionName).insertOne(document);
}

export async function findAll(collectionName) {
    return await collection(collectionName).find({}).toArray();
}

export async function findOne(collectionName, document) {
    return await collection(collectionName).findOne(document);
}

export async function find(collectionName, document) {
    return await collection(collectionName).find(document).toArray();
}

export async function update(collectionName, id, document) {
    return await collection(collectionName).update(id, document);
}

export async function deleteOne(collectionName, id) {
    return await collection(collectionName).deleteOne(id);
}
