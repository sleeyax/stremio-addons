// Convert base32encoded infoHashes to base16, so Stremio can understand it

const helpers = require("../helpers");

const b32Hash = "XIH4ZGT32YIVUUZBNFEDO7PIQYEMRGHH";
const expected = "ba0fcc9a7bd6115a53216948377de88608c898e7";

let b16Hash = helpers.base16encode(helpers.base32decode(b32Hash));

console.log("Expected: " + expected);
console.log("Got: " + b16Hash);
