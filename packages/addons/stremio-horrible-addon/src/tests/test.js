const parse = require("parse-torrent");
const magnet = "magnet:?xt=urn:btih:XIH4ZGT32YIVUUZBNFEDO7PIQYEMRGHH&tr=http://nyaa.tracker.wf:7777/announce&tr=udp://tracker.coppersurfer.tk:6969/announce&tr=udp://tracker.internetwarriors.net:1337/announce&tr=udp://tracker.leechersparadise.org:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://p4p.arenabg.com:1337/announce&tr=udp://mgtracker.org:6969/announce&tr=udp://tracker.tiny-vps.com:6969/announce&tr=udp://peerfect.org:6969/announce&tr=http://share.camoe.cn:8080/announce&tr=http://t.nyaatracker.com:80/announce&tr=https://open.kickasstracker.com:443/announce"
const expected = "ba0fcc9a7bd6115a53216948377de88608c898e7";

console.log("Expected: " + expected);
console.log("Got: " + parse(magnet).infoHash);
