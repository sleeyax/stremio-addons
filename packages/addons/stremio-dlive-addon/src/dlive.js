const request = require("request-promise");
const constants = require("./constants");

class Dlive {
    constructor() {}

    getCategories(offset = -1, count = 50, currentList = []) {
        return request(constants.url, {
            method: "POST",
            json: {
                operationName: "BrowsePageSearchCategory",
                variables: {
                    text: "",
                    first: count,
                    after: offset + ""
                },
                query: "query BrowsePageSearchCategory($text: String!, $first: Int, $after: String) {\n  search(text: $text) {\n    trendingCategories(first: $first, after: $after) {\n      ...HomeCategoriesFrag\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment HomeCategoriesFrag on CategoryConnection {\n  pageInfo {\n    endCursor\n    hasNextPage\n    __typename\n  }\n  list {\n    ...VCategoryCardFrag\n    __typename\n  }\n  __typename\n}\n\nfragment VCategoryCardFrag on Category {\n  id\n  backendID\n  title\n  imgUrl\n  watchingCount\n  __typename\n}\n"
            }
        }).then((response) => {
            currentList = currentList.concat(response["data"]["search"]["trendingCategories"]["list"]);

            // Recursively call this function until we have all categories
            if (response["data"]["search"]["trendingCategories"]["pageInfo"]["hasNextPage"] === true) {
                const next = response["data"]["search"]["trendingCategories"]["pageInfo"]["endCursor"];
                return this.getCategories(next, count, currentList);
            }

            return currentList;
        });
    }

    getLiveStreams(categoryId, offset, count) {
        return request(constants.url, {
            method: "POST",
            json: {
                operationName: "CategoryLivestreamsPage",
                variables: {
                    id: categoryId.toString(),
                    opt: {
                        first: count,
                        after: offset.toString(),
                        languageID: null,
                        order: "TRENDING",
                        showNSFW: true
                    }
                },
                query: "query CategoryLivestreamsPage($id: Int!, $opt: CategoryLivestreamsOption) {\n" + "  category(id: $id) {\n" + "    id\n" + "    backendID\n" + "    title\n" + "    imgUrl\n" + "    watchingCount\n" + "    languages {\n" + "      ...LanguageFrag\n" + "      __typename\n" + "    }\n" + "    livestreams(opt: $opt) {\n" + "      ...VCategoryLivestreamFrag\n" + "      __typename\n" + "    }\n" + "    __typename\n" + "  }\n" + "}\n" + "\n" + "fragment VCategoryLivestreamFrag on LivestreamConnection {\n" + "  pageInfo {\n" + "    endCursor\n" + "    hasNextPage\n" + "    __typename\n" + "  }\n" + "  list {\n" + "    permlink\n" + "    ageRestriction\n" + "    ...VLivestreamSnapFrag\n" + "    __typename\n" + "  }\n" + "  __typename\n" + "}\n" + "\n" + "fragment VLivestreamSnapFrag on Livestream {\n" + "  id\n" + "  creator {\n" + "    username\n" + "    displayname\n" + "    ...VDliveAvatarFrag\n" + "    ...VDliveNameFrag\n" + "    __typename\n" + "  }\n" + "  title\n" + "  totalReward\n" + "  watchingCount\n" + "  thumbnailUrl\n" + "  lastUpdatedAt\n" + "  __typename\n" + "}\n" + "\n" + "fragment VDliveAvatarFrag on User {\n" + "  avatar\n" + "  __typename\n" + "}\n" + "\n" + "fragment VDliveNameFrag on User {\n" + "  displayname\n" + "  partnerStatus\n" + "  __typename\n" + "}\n" + "\n" + "fragment LanguageFrag on Language {\n" + "  id\n" + "  backendID\n" + "  language\n" + "  __typename\n" + "}\n"
            }
        }).then((response) => {
            return {
                list: response["data"]["category"]["livestreams"]["list"],
                category: response["data"]["category"]["title"]
            };
        });
    }
}

module.exports = Dlive;
