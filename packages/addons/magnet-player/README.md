# magnet-player
Find and play content from magnet links, URLs, info hashes or IMDB IDs directly in Stremio by pasting them in the search bar. This addon was developed with Android in mind, but features that are not already built into Stremio desktop (such as `Play URL/Magnet link`) work on desktop too!

## Usage
1. Paste a [supported link](#supported-links) such as a magnet link or media URL into the search bar.
2. Wait for the addon to parse your content. 
3. Tap the first result from the `channel - Play URL/Magnet link Search Results` catalog. Happy watching!

## Supported links
* Any magnet link
* HTTP(S) URL ending and responding with media content of type: `.mkv`, `.avi`, `.mp4`, `.wmv`, `.vp8`, `.mov`, `.mpg`, `.mp3` or `.flac`
* Info hash (case insensitive) e.g: `a3fbda1961fbc908026ec7cc4569d5fbef840c1e`

## FAQ:
**My link isn't working**

Some links like magnet links might take a while to load, because they need to be parsed (when uncached). I can't force any kind of loading screen to show either (Stremio limitation). You should only be concerned if the catalog doesn't load after +- 60 seconds of waiting. If it doesn't load BUT the same link works fine when pasted in the desktop version of Stremio, please open [an issue](https://github.com/sleeyax/stremio-addons/issues) on this repository.

**You do know that you can also open a magnet link by clicking it from a browser and selectiong 'open in Stremio', right?**

Yes, but the default magnet link opener is very basic and doesn't include nice visuals such as the actual title of the media and background image :)

## Screenshots
![preview 1](docs/assets/preview1.png)
![preview 2](docs/assets/preview2.png)
