const {config} = require('dotenv');
const express = require('express');
const {join} = require('path');
const {promisify} = require('util');
const fs = require('fs');
const readDir = promisify(fs.readdir);

const app = express();
const port = process.argv[2] || 80;

const aliases = {
    '1337x': '1337x-torrents',
    'rarbg': 'rarbg-torrents',
    'sqf': 'stream-quality-filter' 
};

/**
 * Load all addon modules dynamically
 */
function initModules() {
    const rootDir = join(__dirname, '..', '..');

    const addonDirectories = fs.readdirSync(rootDir, { withFileTypes: true })
        .filter(dir => dir.isDirectory() && !dir.name.startsWith('aio'))
        .map(dir => dir.name);

    const serverlessModules = {};

    addonDirectories.forEach(addonDirName => {
        const addonDir = join(rootDir, addonDirName);

        // load .env file if it exists
        const envFile = join(addonDir, '.env');
        if (fs.existsSync(envFile))
            config({path: envFile});

        // load the addon
        const sourceDirs = ['src', 'build'];
        for (const i in sourceDirs) {
            const sourceDir = sourceDirs[i];
            const path = join(addonDir, sourceDir, 'serverless.js');
            if (fs.existsSync(path)) {
                serverlessModules[addonDirName] = require(path);
                break;
            }
        }
    });

    console.log(`Initialized ${Object.keys(serverlessModules).length} addons`);

    return serverlessModules;
}

const addonModules = initModules();

const loadAddon = (name) => addonModules[name] || null;

app.get('/', (_, res) => res.sendFile(join(__dirname, 'static', 'index.html')));

app.get('/:addon/:route(*)', (req, res) => {
    const addonName = aliases[req.params.addon] || req.params.addon;

    const serverlessFunc = loadAddon(addonName);
    
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
