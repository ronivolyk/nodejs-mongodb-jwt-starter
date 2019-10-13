import { ObjectId } from 'mongodb';
import peopleCollection from './PeopleCollection';

export async function find(query) {
    let people = await peopleCollection.find(query);

    return {
        msg: `${people.length} ${people.length === 1 ? 'person' : 'people'} found`,
        data: people
    };
}

export async function insert(person) {
    let result = await peopleCollection.insertOne(person);

    return {
        msg: `${person._id} inserted`,
        data: result
    };
}

export async function findById(id) {
    let _id = { _id: new ObjectId(id) };
    let result = await peopleCollection.findOne(_id);

    return {
        msg: `${id} ${result ? 'found' : 'not found'}`,
        data: result
    };
}

export async function updateById(id, person) {
    let resultFind = await findById(id);
    let personFound = resultFind.data;

    if (!personFound) {
        return resultFind;
    }

    let _id = { _id: personFound._id };
    let result = await peopleCollection.updateOne(_id, person);

    return {
        msg: `${id} updated`,
        data: result
    };
}

export async function deleteById(id) {
    let resultFind = await findById(id);
    let personFound = resultFind.data;

    if (!personFound) {
        return resultFind;
    }

    let _id = { _id: personFound._id };
    let result = await peopleCollection.deleteOne(_id);

    return {
        msg: `${id} deleted`,
        data: result
    };
}
