const QUICK_SEARCH_RESOURCE = 'qsearch';
const {addonBuilder} = require('stremio-addon-sdk');

/**
 * Add quick search support to this addon
 * @param {addonBuilder} addonBuilder 
 */
function enableQuickSearch(addonBuilder) {
    /**
     * (Extension) handler to provide quick search results for the 'Quick Search' addon
     * @param handler {Function}
     */
    addonBuilder.prototype.defineQuickSearchHandler = function (handler) {
        this.defineResourceHandler(QUICK_SEARCH_RESOURCE, handler);
    };
}

module.exports = {
    enableQuickSearch,
    QUICK_SEARCH_RESOURCE
}