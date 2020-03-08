export function stringBetween(text: string, startChar: string, endChar: string) {
    const start = text.indexOf(startChar) + 1;
    const end = text.indexOf(endChar, start);
    return text.substring(start, end)
}

/**
 * Resolve all promises and ignore rejected
 */
export async function resolveAllPromises<T>(promises: Array<Promise<T>>) {
    const results = [];
    
    for (let i= 0; i<promises.length; i++) {
        const promise = promises[i];
        try {
            results.push(await promise);
        } catch {} // ignore rejected
    }

    return results;
}