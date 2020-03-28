const {config} = require('dotenv');
const express = require('express');
const {join} = require('path');
const {promisify} = require('util');
const fs = require('fs');
const pathExists = promisify(fs.exists);
const readDir = promisify(fs.readdir);

const app = express();
const port = process.argv[2] || 80;

const aliases = {
    '1337x': '1337x-torrents',
    'rarbg': 'rarbg-torrents',
    'sqf': 'stream-quality-filter' 
};

/**
 * Tries to load the serverless function of specified addon.
 * Returns null if it doesn't exist.
 * @param {string} addon name of the addon
 */
async function loadServerlessFunc(addon) {
    const addonDir = join(__dirname, '..', '..', addon);
    
    // load .env file if it exists
    const envFile = join(addonDir, '.env');
    if (await pathExists(envFile))
        config({path: envFile});

    // load the addon
    let serverlessFile;
    const dirs = ['src', 'build'];
    for (const i in dirs) {
        const dir = dirs[i];
        const path = join(addonDir, dir, 'serverless.js');
        if (await pathExists(path)) {
            serverlessFile = path;
            break;
        }
    }

    return serverlessFile ? require(serverlessFile) : null;
}

app.get('/', (_, res) => res.sendFile(join(__dirname, 'static', 'index.html')));

app.get('/:addon/:route(*)', async (req, res) => {
    const addonName = aliases[req.params.addon] || req.params.addon;

    const serverlessFunc = await loadServerlessFunc(addonName);
    
    if (serverlessFunc != null) {
        req.url = '/' + req.params.route;
        serverlessFunc(req, res);

    } else {
        res.send('Not found').status(404);
    }
});

app.get('/addons', async (req, res) => {
    const addonsDir = join(__dirname, '..', '..');
    const directories = (await readDir(addonsDir, { withFileTypes: true }))
        .filter(dir => dir.isDirectory() && !dir.name.startsWith('aio'))
        .map(dir => dir.name);
    res.send(directories);
});

app.listen(port, () => console.log(`Listening on http://127.0.0.1:${port}`))
