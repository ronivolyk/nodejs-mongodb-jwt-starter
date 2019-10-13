import { ObjectId } from 'mongodb';
import * as Crypto from '../security/Crypto';
import mongoCollection from "../mongo/MongoCollection";

const COLLECTION_NAME = 'users';
const PROJECTION = { password: 0 };

let collection = mongoCollection(COLLECTION_NAME);

export async function find(queryUser) {
    let users = await collection.find(queryUser, PROJECTION);

    return {
        msg: `${users.length} ${users.length === 1 ? 'user' : 'users'} found`,
        data: users
    };
}

export async function insert(user) {
    let userByEmail = await findByEmail(user.email);

    if (userByEmail.data) {
        return { msg: `E-mail ${user.email} is already registered` };
    }

    let userByUsername = await findByUsername(user.username);

    if (userByUsername.data) {
        return { msg: `Username ${user.username} is already registered` };
    }

    let hash = await Crypto.getHash(user.password);

    user = {
        name: user.name,
        email: user.email,
        username: user.username,
        password: hash
    };

    let result = await collection.insertOne(user);

    return {
        msg: `${user._id} inserted`,
        data: result
    };
}

export async function findById(id) {
    let _id = { _id: new ObjectId(id) };
    let result = await collection.findOne(_id, PROJECTION);

    return {
        msg: `${id} ${result ? 'found' : 'not found'}`,
        data: result
    };
}

export async function findByEmail(email) {
    let result = await collection.findOne({ email }, PROJECTION);

    return {
        msg: `${email} ${result ? 'found' : 'not found'}`,
        data: result
    };
}

export async function findByUsername(username) {
    let result = await collection.findOne({ username }, PROJECTION);

    return {
        msg: `${username} ${result ? 'found' : 'not found'}`,
        data: result
    };
}

export async function updateById(id, user) {
    let resultFind = await findById(id);
    let userFound = resultFind.data;

    if (!userFound) {
        return resultFind;
    }

    let _id = { _id: userFound._id };

    user = {
        name: (user.name) ? user.name : userFound.name,
        email: (user.email) ? user.email : userFound.email
    };

    let result = await collection.updateOne(_id, user);

    return {
        msg: `${id} updated`,
        data: result
    };
}

export async function deleteById(id) {
    let resultFind = await findById(id);
    let userFound = resultFind.data;

    if (!userFound) {
        return resultFind;
    }

    let _id = { _id: userFound._id };

    let updateQuery = { deactivated: true }

    let result = await collection.updateOne(_id, updateQuery)

    return {
        msg: `${id} deactivated`,
        data: result
    };
}
