const fs = require("fs");
const ListenNotesProvider = require("./providers/listennotes");
const rimraf = require("rimraf");
const dir = "cache";

function generate() {

    if (!fs.existsSync(dir))
        fs.mkdirSync(dir);

    // Generate listennotes cache
    const listenNotesProvider = new ListenNotesProvider(process.env.LISTEN_NOTES_API_KEY);
    const lnGenres = dir + "/listennotes-genres.json";
    if (!fs.existsSync(lnGenres)) {
        listenNotesProvider.queryAPI("/genres").then(res => {
            fs.writeFile(lnGenres, JSON.stringify(res), (err) => {
                if (!err)
                    console.log("Successfully wrote to cache file " + lnGenres);
            });
        });
    }
}

function clear() {
    rimraf(dir, () => {
        console.log("Successfully cleared cache!");
    });
}

if (process.argv.length === 3) {
    const cmd = process.argv[2];
    switch (cmd) {
        case "gen":
            generate();
            break;
        case "clear":
            clear();
            break;
    }
}else{
    console.error("Invalid argumebts: expected 'clear', 'gen'. Example: 'node cache.js gen'");
}

