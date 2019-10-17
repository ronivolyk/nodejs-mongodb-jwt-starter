import { ObjectId } from 'mongodb';
import * as crypto from '../security/Crypto';
import mongoCollection from "../mongo/MongoCollection";

const COLLECTION_NAME = 'users';
const PROJECTION = { password: 0 };
const PROJECTION_WITH_PASSWORD = { password: 1 };

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

    let hash = await crypto.getHash(user.password);

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
    let user = await collection.findOne(_id, PROJECTION);

    return {
        msg: `${id} ${user ? 'found' : 'not found'}`,
        data: user
    };
}

export async function findByEmail(email) {
    let user = await collection.findOne({ email }, PROJECTION);

    return {
        msg: `${email} ${user ? 'found' : 'not found'}`,
        data: user
    };
}

export async function findByUsername(username) {
    let user = await collection.findOne({ username }, PROJECTION);

    return {
        msg: `${username} ${user ? 'found' : 'not found'}`,
        data: user
    };
}

export async function findHashByUsername(username) {
    let user = await collection.findOne({ username }, PROJECTION_WITH_PASSWORD);

    if (!user) {
        return {
            msg: `${username} not found`,
        };    
    }

    return {
        msg: `${username} found`,
        data: user.password
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
