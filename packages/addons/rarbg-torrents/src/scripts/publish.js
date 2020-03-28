const { publishToCentral } = require("stremio-addon-sdk");

if (process.argv.length == 3) {
    const url = process.argv[2];
    console.log("Publishing " + url + " to central");
    publishToCentral(url).then(response => console.log(response));
}else{
    console.error("Please specify a string with the url to your manifest.json file");
}
