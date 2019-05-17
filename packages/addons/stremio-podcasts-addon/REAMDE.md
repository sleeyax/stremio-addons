<h1 align="center">
  <img width="150" src="https://i.imgur.com/7UJTRkI.png" />
  <p>Stremio podcasts</p>
</h1>

<h4 align="center">Original Podcasts Addon offering High Quality Podcasts for <a href="https://www.stremio.com/" target="_blank">Stremio</a>
</h4>

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/for-you.svg)](https://forthebadge.com)

> Currently over 688,345 podcasts available!

## Features
* Always included
    * Filter by genre (sorted)
    * Search all podcasts
    * Show top podcasts
    * Infinite scroll (pagination)
* 685,945+ podcasts from [listen notes](https://www.listennotes.com/) featuring
    * All languages
    * Random podcast generator
    * Explicit content warning
    * Show average episode length
    * Podcast source & social media links
* 2400+ podcasts from [gpodder](https://www.gpodder.net/) featuring
    * Searchable episodes

## Screenshots
**catalog**
![listen notes catalog](https://i.imgur.com/AGcNgNj.jpg)

**episode selection**
![listen notes episode selection](https://i.imgur.com/eOCbIUp.png)

## Installation
There are multiple ways to install this addon. Luxurious!
* Click on the addon manager icon ![addon manager icon](https://i.imgur.com/oFBLNem.png) on the top right. Browse or search for `Podcasts` and click install. 
* Go to the [homepage](https://stremio-podcasts-addon.sleeyax.now.sh/) of this addon and click `install`.
* Open the addon manager and paste `https://stremio-podcasts-addon.sleeyax.now.sh/manifest.json` in the addon repository field.<br>
![addon repo field](https://i.imgur.com/RODMkww.png)

## Running locally
First of all make sure you have a recent version of nodejs (https://nodejs.org/) installed. Then clone this repo and run:
```
npm install
```
Now copy `.env.example` to `.env` and edit the following lines:
```
LISTEN_NOTES_API_KEY=xxx
```
Replace 'xxx' with your [listen notes API](https://www.listennotes.com/api/) key.

To start a development server that watches for file changes run `npm run start:watch`. In production you should be using `npm run start`.

## Contributing
Feel free to [open an issue](https://github.com/sleeyax/stremio-podcasts-addon/issues/new) in case of any problems. Pull requests are also greatly appreciated, but please open an issue first so it can be referenced.

Licensed under the [MIT License](https://mit-license.org/).
