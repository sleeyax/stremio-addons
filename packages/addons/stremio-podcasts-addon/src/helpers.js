function b64encode(plaintext) {
    return Buffer.from(plaintext).toString('base64');
}

function b64decode(b64encodedString) {
    return Buffer.from(b64encodedString, "base64").toString();
}

function toHumanReadableFileSize(bytes) {
    if (Math.abs(bytes) < 1024) { return bytes + ' B'; }

    const units = ['kB','MB','GB','TB','PB','EB','ZB','YB'];

    let i = -1;
    do {
        bytes /= 1024;
        ++i;
    } while(Math.abs(bytes) >= 1024 && i < units.length - 1);

    return bytes.toFixed(1) +" " + units[i];
}

/**
 * @param {Array} items
 * @return {number}
 */
function calcAverage(items) {
    let total = 0;
    items.forEach(item => {
        total += item;
    });

    return total / items.length;
}

function getFullYear(datestring) {
    return new Date(datestring).getFullYear();
}

module.exports = {
    toHumanReadableFileSize,
    b64encode,
    b64decode,
    getFullYear,
    calcAverage
};
