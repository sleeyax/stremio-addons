# stremio-addons
More of my stremio addons in one monorepo.

##  Addons
List of working addons

* [stream quailty filter](packages/addons/stream-quality-filter)
* [ASMR from Tingles](packages/addons/asmr-from-tingles)
* [IPTV from RedBox](packages/addons/redbox-tv)

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
All addons are written in [TypeScript](https://www.typescriptlang.org/). Also, [lerna](https://lerna.js.org/) is used to manage the monorepo.

### Installation
To install all required developer dependencies that are shared accross addons, navigate to the root directory (the directory where this README is in) and run `npm install`. Next, run `lerna bootstrap` at the repo root to get all dependencies for all addons. You can also ignore lerna completely and get dependencies for a single addon by running `npm install` within that addon directory as usual.
