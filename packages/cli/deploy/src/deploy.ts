#!/usr/bin/env node
import {config} from 'dotenv';
config();
import { existsSync } from 'fs';
import { join } from 'path';
import { program } from 'commander';
import { exec } from 'child_process';
import rimraf from 'rimraf';

program.version('0.0.1');
program.requiredOption('-u, --url <url>', 'caprover server URL', process.env.CAPROVER_URL);
program.requiredOption('-p, --password <password>', 'caprover password', process.env.CAPROVER_PASSWORD);
program.requiredOption('-a, --addon <path>', 'path to addon to deploy');
program.requiredOption('-n, --name <app name>', 'app name to deploy to');
program.option('-m, --message <short description>', 'commit message');

program.parse(process.argv);

if (!existsSync(program.addon))
    throw new Error(`path ${program.addon} does not exist`);

// create git commit
const packageJson = join(program.addon, 'package.json');
if (!existsSync(packageJson))
    throw new Error(`package.json not found in ${program.addon}`);
const msg = require(packageJson).version + (program.message ? ' ' + program.message : '');
console.log('initializing');
exec(`cd ${program.addon} && git init && git add -A && git commit -am "${msg}"`, (err, stdOut, stdErr) => {
    if (err) throw err;
    if (stdErr) throw new Error(stdErr);
    console.log(`deploying ${program.name} to ${program.url}`);
    // deploy
    exec(`cd ${program.addon} && caprover deploy -u ${program.url} -p ${program.password} -a ${program.name}`, (err, stdOut, stdErr) => {
        if (err) throw err;
        if (stdErr) throw new Error(stdErr);
        console.log('performing cleanup');
        // cleanup
        const gitDir = join(program.addon, '.git');
        if (existsSync(gitDir)) {
            rimraf(gitDir, err => {
                if (err) throw err;
                console.log('done!');
            });
        }
    })
});
