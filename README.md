# stremio-addons
More of my stremio addons in one monorepo.

##  Addons
List of working addons

* [stream quailty filter](packages/addons/stream-quality-filter)
* [ASMR from Tingles](packages/addons/asmr-from-tingles)

## Project structure
Overview of how this project is structured:
```
- @types // contains typescript declaration files (d.ts) for the addon SDK
- packages
  - addons // all stremio addons go here
  - cli   // command line tools to aid development
- tsconfig.json // global typescript config file, which all addons extend
- package.json // global package.json file that contains dev dependencies that are required by every package
```

## Info for developers
[lerna](https://lerna.js.org/) is used to manage the monorepo, but you should be able to build and run a single addon without it. Running `npm install` in the addon directory should do the trick. However, if you already have lerna installed just run `lerna bootstrap` at the repo root to get all dependencies for all packages. If you do not have lerna installed yet, run `npm install` at the repo root (the directory where this README is in) and proceed with the command above.
