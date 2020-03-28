// Serve the landing page as static HTML
const addonInit = require("../addon");
const landingTemplate = require("../landingTemplate");
const http = require("http");

addonInit().then(addonInterface => {
    const landingHTML = landingTemplate(addonInterface.manifest);

    http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(landingHTML);
    }).listen(8080);

    console.log("Listening on http://127.0.0.1:8080");
});
