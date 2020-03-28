function b64encode(plaintext) {
    return Buffer.from(plaintext).toString('base64');
}

function b64decode(b64encodedString) {
    return Buffer.from(b64encodedString, "base64").toString();
}

module.exports = {
    b64encode,
    b64decode
};
