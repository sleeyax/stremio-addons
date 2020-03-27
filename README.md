# stremio-addons
More of my stremio addons in one monorepo.

## Addons
List of working addons.

### Remote
* [stream quailty filter](packages/addons/stream-quality-filter)
* [ASMR from Tingles](packages/addons/asmr-from-tingles)

### Local
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
All addons are written in [TypeScript](https://www.typescriptlang.org/). To manage this monorepo, [lerna](https://lerna.js.org/) is used.

### Installation
To install all required developer dependencies that are shared accross addons, navigate to the root directory (the directory where this README is in) and run `npm i`. 

#### Addon dependencies
To install all dependencies of all addons at once, you can enter the command `lerna bootstrap` at the project root.
If you'd rather not use lerna, you can also install dependencies for a single addon by running `npm install` within that addon directory as usual.

#### Transpiling
You can transpile all addons at once with lerna: `lerna run tsc` or head to a specific addon directory and run `npm run tsc`.
The target addon(s) should now have a `build` directory next to the `src` directory, containing the transpiled javascript files. To run a debug server for instance, you would usually run `node build/server.js` to start it. 

## Roadmap
At the end, this repo should contain my other addons (which are now each in their own respective repos) as well. This wil make managing them all much easier, especially if they are deployed on a VPS.