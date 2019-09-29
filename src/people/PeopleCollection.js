import { MongoCollection } from "../mongo/MongoCollection";

const COLLECTION_NAME = 'people';

export class PeopleCollection extends MongoCollection {
    constructor() {
        super(COLLECTION_NAME);
    }
}