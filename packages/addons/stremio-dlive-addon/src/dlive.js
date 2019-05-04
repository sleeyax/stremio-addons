const request = require("request-promise");
const constants = require("./constants");
const m3u8 = require("m3u8-stream-list");

class Dlive {

    getCategories(offset = -1, count = 50, currentList = []) {
        return this.sendPost(constants.url, "BrowsePageSearchCategory", {
            text: "",
            first: count,
            after: offset.toString()
        }, constants.queries.BrowsePageSearchCategory)
            .then(response => {
                currentList = currentList.concat(response["data"]["search"]["trendingCategories"]["list"]);

                // Recursively call current function until we have all categories
                if (response["data"]["search"]["trendingCategories"]["pageInfo"]["hasNextPage"] === true) {
                    const next = response["data"]["search"]["trendingCategories"]["pageInfo"]["endCursor"];
                    return this.getCategories(next, count, currentList);
                }

                return currentList;
            });
    }

    getLiveStreams(categoryId, offset, count) {
        return this.sendPost(constants.url, "CategoryLivestreamsPage", {
            id: categoryId.toString(),
            opt: {
                first: count,
                after: offset.toString(),
                languageID: null,
                order: "TRENDING",
                showNSFW: true
            }
        }, constants.queries.CategoryLivestreamsPage)
            .then(response => response["data"]["category"]["livestreams"]["list"]);
    }

    sendPost(url, operationName, variables, query) {
        return request(url, {
            method: "POST",
            json: {operationName: operationName, variables: variables, query: query}
        });
    }

    getUserInfo(displayname) {
        return request(constants.url, {
            method: "POST",
            json: {
                operationName: "LivestreamPage",
                variables: {
                    add: false,
                    displayname,
                    isLoggedIn: false
                },
                query: constants.queries.LivestreamPage
            }
        }).then((response) => {
            return response["data"]["userByDisplayName"];
        });
    }

    searchLiveStreams(searchTerm) {
        return this.sendPost(constants.url, "SearchPage", {
            first: 10, text:
            searchTerm,
            isLoggedIn: false
        }, constants.queries.SearchPage)
            .then(response => response["data"]["search"]["livestreams"]["list"]);
    }

    getStreamSources(username) {
        // dlive_user:username|displayname
        username = username.split(":")[1].split("|")[0];
        return request(constants.url_streams + username + ".m3u8").then(response => {
            return m3u8(response);
        });
    }
}

module.exports = Dlive;
