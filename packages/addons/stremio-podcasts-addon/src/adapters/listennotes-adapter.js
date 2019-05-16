const BaseAdapter = require("./base-adapter");
const ListenNotes = require("../providers/listennotes");

class ListenNotesAdapter extends BaseAdapter{
    constructor() {
        super();
        this.provider = new ListenNotes(process.env.LISTEN_NOTES_API_KEY);
    }

    async getGenres() {
        return (await this.provider.getAllCategories()).genres.map(category => category.name);
    }

    async getSummarizedMetaDataCollection(args) {}

    async getMetaData(args) {}

    async getStreams(args) {}

}

module.exports = ListenNotesAdapter;