const b32 = require('b32');

function b64encode(plaintext) {
    return Buffer.from(plaintext).toString('base64');
}

function b64decode(b64encodedString) {
    return Buffer.from(b64encodedString, "base64").toString();
}

function todayMinDays(days) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d;
}

function base32decode(encoded) {
    return b32.decodeSync(encoded);
}

function base16encode(plaintext){
    return Buffer.from(plaintext, "utf-8").toString("hex")
}

function base16decode(encoded) {
    return Buffer.from(encoded, "hex").toString();
}

module.exports = {
    b64encode,
    b64decode,
    todayMinDays,
    base32decode,
    base16encode,
    base16decode
};
