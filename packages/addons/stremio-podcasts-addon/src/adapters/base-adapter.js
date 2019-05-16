/**
 * Adapters are the glue between providers and the handlers specified in addon.js
 * They convert raw API data to objects which the stremio addon SDK can understand
 */

class BaseAdapter {
    /**
     * Returns all genres to be used in the manifest
     *
     * */
    async getGenres() {throw "getGenres() must be implemented!"}

    /**
     * Summarized collection of meta items
     * @param args
     **/
    async getSummarizedMetaDataCollection(args) {throw "getSummarizedMetaDataCollection() must be implemented!"}

    /**
     * Detailed description of meta item
     * @param args
     **/
    async getMetaData(args) {throw "getMetaData() must be implemented!"}

    /**
     * Tells Stremio how to obtain the media content
     * @param args
     */
    async getStreams(args) {throw "getStreams() must be implemented!"}
}

module.exports = BaseAdapter;
