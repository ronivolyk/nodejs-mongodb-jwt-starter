import { MongoCollection } from "./MongoCollection";

const COLLECTION_NAME = 'people';

export class PeopleCollection extends MongoCollection {
    constructor() {
        super(COLLECTION_NAME);
    }
}