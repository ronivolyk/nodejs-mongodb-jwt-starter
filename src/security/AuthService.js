import * as crypto from './Crypto';
import * as tokenService from './TokenService';
import * as service from '../users/UsersService';
import AuthenticationError from './AuthenticationError';

export async function tryLogin(login) {
    let resultHash = await service.findHashByUsername(login.username);
    let hash = resultHash.data;

    if (!hash) {
        return {
            msg: `${login.username} not found`,
            statusCode: 401
        };
    }

    let isPasswordOk = await crypto.validateHash(login.password, hash);

    if (!isPasswordOk) {
        return {
            msg: `Invalid username/password`,
            statusCode: 401
        };
    }
    
    let resultUser = await service.findByUsername(login.username);
    let user = resultUser.data;

    if (user.deactivated) {
        return {
            msg: `${login.username} is deactivated`,
            statusCode: 401
        };
    }

    let token = tokenService.getToken(user);

    return {
        msg: `${user.username} logged in successfully`,
        data: { user, token }
    }
}

export function readToken(headers) {
    let authorization = headers.authorization;

    if (!authorization) {
        throw new AuthenticationError('Authorization header not found');
    }

    if (authorization.indexOf('Bearer ') < 0) {
        throw new AuthenticationError('Authorization header is not Bearer');
    }

    let token = authorization.replace('Bearer ', '');

    try {
        return tokenService.validateToken(token);
    } catch (e) {
        throw new AuthenticationError(e.message);
    }
}