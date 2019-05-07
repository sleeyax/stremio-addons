const request = require("request-promise");
const feedParser = require("podcast-feed-parser");
const {debug} = require("../src/helpers");

request("http://leo.am/podcasts/floss").then(response => {
    const podcastFeed = feedParser.getPodcastFromFeed(response);
    debug(podcastFeed);
});
