export function b64encode(text: string) {
    return Buffer.from(text).toString('base64');
}

export function b64decode(encoded: string) {
    return Buffer.from(encoded, 'base64').toString('ascii');
}
