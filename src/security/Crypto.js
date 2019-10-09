import * as bcrypt from 'bcrypt';

export async function getHash(password) {
    let hash = await bcrypt.hash(password, 12);
    return hash;
}

export async function validateHash(password, hash) {
    let isValid = await bcrypt.compare(password, hash);
    return isValid;
}
