import { insert, findAll, findOne, find } from "./MongoCollection";

const COLLECTION = 'people';

export async function insertPerson(person) {
    return await insert(COLLECTION, person);
}

export async function findAllPeople() {
    return await findAll(COLLECTION);
}

export async function findPerson(person) {
    return await findOne(COLLECTION, person);
}

export async function searchPerson(person) {
    return await find(COLLECTION, person);
}
