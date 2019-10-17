import * as jwt from 'jsonwebtoken';

const SECRET = 'secret';
const EXPIRATION = '1h';

export function getToken(user) {
    let payload = {
        username: user.username,
        name: user.name
    };

    return jwt.sign(payload, SECRET, { expiresIn: EXPIRATION });
}

export function validateToken(token) {
    return jwt.verify(token, SECRET);
}
