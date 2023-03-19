This repository has been archived because most of these addons no longer work and I don't intend to revive most of them any time soon. My next addon will likely be in a new repository.

# stremio-addons
All of my [Stremio](https://www.stremio.com/) addons in one monorepo. Read more about the advantages of monorepos [here](https://danluu.com/monorepo/).

## Addons

### Archived
Addons that are not maintained by me anymore but are kept for reference. Some of these still work, others probably don't. If you want to resurrect any of these addons, create a pull requests to become its maintainer!
* [ASMR from Tingles](packages/addons/asmr-from-tingles)
  * requires update (see https://github.com/sleeyax/stremio-addons/issues/6) but no-one used this addon anyways
* Archived in favor of [Torrentio](https://github.com/TheBeastLT/torrentio-scraper/tree/master/addon)
  * [Stream Quality Filter (SQF)](packages/addons/stream-quality-filter)
  * [1337x torrents](packages/addons/1337x-torrents)
  * [RARBG torrents](packages/addons/rarbg-torrents)
* Archived [Anime torrents from horriblesubs](packages/addons/horriblesubs) because [horriblesubs was killed by COVID-19](https://www.twitlonger.com/show/n_1sre2m4)
* Archived [Podcasts](packages/addons/podcasts) in favor of [Podcasts for All](https://github.com/NivM1/podcasts-for-all).
* Arhived [Cartoon Extra](packages/addons/cartoonextra) because it has been taken down.
* Archived [Search and Play](packages/addons/search-and-play) due to technical difficulties regarding hosting. Could be fixed, but only very few people used this addon anyways.
* Archived [Watch Cartoon Online (WCO)](packages/addons/watchcartoononline) becausee it seems broken and I no longer care to fix it.
* Archived [Livestreams from dlive.tv](packages/addons/dlive) because the addon hasn't been upated for a while. Search is broken and livestreams don't fully load.
* Archived [XNXX](packages/addons/xnxx) because the free HTTP proxy it requires stopped working. The addon itself still works fine though, feel free to run it locally.
* Archived [IPTV from RedBox](packages/addons/redbox-tv) (local addon)

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

### Docker
This repository is docker-ready with [docker compose](https://docs.docker.com/compose/). To get all addons up and running in production, enter `docker-compose up -d` in your terminal and you should be ready to go! Don't forget adjust your `.env` files in each addon directory so all environment variables are set up properly.

If you're not using docker compose, make sure the `stremio-ts-addon` and/or `stremio-js-addon` images are built locally before building any of the addon docker images.

#### Kubernetes
If you're hardcore like me, you can also deploy maintained addons to a Kubernetes cluster. See the [kubernetes](./kubernetes/README.md) directory for basic installation instructions.

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
| kubernetes | Anything that has to do with Kubernetes deployments           | `kubernetes: update config`                                                   |

### Issues
When creating an issue, please append the subject (and optionally the keyword) in square brackets to your title.

Format: `<[keyword/]subject> <issue title>`

Examples:

`[addon/stream-quality-filter] filters not working`
<br>
`[stream-quality-filter] add filter X`

Both conventions are accepted as of now, just to keep things simple. The former notation is preferred though.
