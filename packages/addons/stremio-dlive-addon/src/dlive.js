const request = require("request-promise");
const constants = require("./constants");

class Dlive {
    constructor() {}

    getCategories() {
        return request(constants.url, {
            method: "POST",
            json: {
                "operationName": "BrowsePageSearchCategory",
                "variables": {
                    "text": "",
                    "first": 9999999999,
                    "after": "0"
                },
                "query": "query BrowsePageSearchCategory($text: String!, $first: Int, $after: String) {\n  search(text: $text) {\n    trendingCategories(first: $first, after: $after) {\n      ...HomeCategoriesFrag\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment HomeCategoriesFrag on CategoryConnection {\n  pageInfo {\n    endCursor\n    hasNextPage\n    __typename\n  }\n  list {\n    ...VCategoryCardFrag\n    __typename\n  }\n  __typename\n}\n\nfragment VCategoryCardFrag on Category {\n  id\n  backendID\n  title\n  imgUrl\n  watchingCount\n  __typename\n}\n"
            }
        }).then((response) => {
            return response["data"]["search"]["trendingCategories"]["list"];
        });
    }
}

module.exports = Dlive;
