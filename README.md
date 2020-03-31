# stremio-addons
All of my [Stremio](https://www.stremio.com/) addons in one monorepo. Read more about the advantages of monorepos [here](https://danluu.com/monorepo/).

## Addons
List of working addons:

### Remote
* [Stream Quality Filter (SQF)](packages/addons/stream-quality-filter) *
* [1337x torrents](packages/addons/1337x-torrents)
* [RARBG torrents](packages/addons/rarbg-torrents)
* [Anime torrents from horriblesubs](packages/addons/horriblesubs)
* [Livestreams from dlive.tv](packages/addons/dlive)
* [ASMR from Tingles](packages/addons/asmr-from-tingles) *
* [Podcasts](packages/addons/podcasts)

\* this addon is a submission for the [addon competition](https://www.stremio.com/competition) of March-April 2020.

### Local
* [IPTV from RedBox](packages/addons/redbox-tv)

## Project structure
Overview of how this project is structured:
```
- @types // contains typescript declaration files (d.ts) for the addon SDK
- packages
  - addons // all stremio addons go here
  - cli   // command line tools to aid development
  - modules // other useful packages that can be imported by addons
- tsconfig.json // global typescript config file, which all addons extend
- package.json // global package.json file that contains dev dependencies that are required by every package
```

## Info for developers
Newer addons are written in [TypeScript](https://www.typescriptlang.org/). To manage this monorepo, [lerna](https://lerna.js.org/) is used.

The `@types` that are available in this repo are also available on [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped): `npm install @types/stremio-addon-sdk --save-dev`. 

### Installation
To install all required developer dependencies that are shared accross addons, navigate to the root directory (the directory where this README is in) and run `npm install`. 

#### Addon dependencies
To install all dependencies of all addons at once, you can enter the command `npm run bootstrap` at the project root. If you'd rather not use lerna, you can also install dependencies for a single addon by running `npm install` within that addon directory as usual.

#### Transpiling
You can transpile all addons at once with lerna by executing: `npm run build` or you can also head to a specific addon directory and run `npm run tsc`.
The target addon(s) should now each have a `build` directory next to the `src` directory, containing the transpiled javascript files. To run a debug server for instance, you would usually run `node build/server.js` to start it. 

### Conventions
#### Commit messages
Commit messages should respect the following convention table:

| keyword | description                                                      | example                                                                           |
|---------|------------------------------------------------------------------|-----------------------------------------------------------------------------------|
| global  | global changes that affects many packages or the repo as a whole | <br>`global: update lerna config file`<br>`global: remove console.log()s`         |
| addon   | changes to an existing addon or adding a new one                 | <br>`addon/stream-quality-filter: add more filters`<br>`addon: create IPTV addon` |
| cli     | changes to cli packages or adding a new one                      | <br>`cli/publisher: support IPFS publish`<br>`cli: add tool x`                    |
| module  | changes to (npm) modules or adding a new one                     | `module/extension: fix Y`<br>`module: add extension`                              |
| script  | pure shell, bash or batch helper scripts                         | `script: add deployment script`                                                   |

### Issues
When creating an issue, please append the subject (and optionally the keyword) in square brackets to your title.

Format: `<[keyword/]subject> <issue title>`

Examples:

`[addon/stream-quality-filter] filters not working`
<br>
`[stream-quality-filter] add filter X`

Both conventions are accepted as of now, just to keep things simple. The former notation is preferred though.
