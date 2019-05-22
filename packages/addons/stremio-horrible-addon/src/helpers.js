const b32 = require('b32');

function b64encode(plaintext) {
    return Buffer.from(plaintext).toString('base64');
}

function b64decode(b64encodedString) {
    return Buffer.from(b64encodedString, "base64").toString();
}

function base32decode(encoded) {
    return b32.decodeSync(encoded);
}

function base16encode(plaintext){
    return Buffer.from(plaintext, "utf-8").toString("hex")
}


module.exports = {
    b64encode,
    b64decode,
    base32decode,
    base16encode
};
