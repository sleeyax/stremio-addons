const redis = require('redis');
const {genRandomString} = require('./utils');
const TorrentAPI = require('./torrentapi');

const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST, {
    password: process.env.REDIS_PASSWORD,
});

// client.on('error', (err) => console.error(err));

function getValue(key = process.env.REDIS_KEY) {
    return new Promise((resolve, reject) => {
        client.get(key, (err, reply) => {
            if (err) reject(err);
            resolve(reply);
        });
    });
}

async function generateValue() {
    const appId = genRandomString();
    const response = await TorrentAPI.getToken(appId);

    if (!response.token) throw new Error(`Failed to generate new token for appid '${appId}': token not found in response body!`);

    const value = `${appId}:${response.token}`;
    setValue(value);

    return value;
}

function setValue(value, key = process.env.REDIS_KEY) {
    client.set(key, value);
}

function close() {
    client.quit();
}

module.exports = {getValue, setValue, generateValue, close};

