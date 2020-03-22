/**
 * Check if a string contains text from an array of substrings. 
 * Returns the value and index of the found item.
 * @param text target text to search
 * @param arr values to search for
 */
export function findAnyOf(text: string, arr: string[]) {
    for (let i = 0; i < arr.length; i++) {
        const value = arr[i];
        if (text.toLowerCase().indexOf(value) > -1) return { value, index: i };
    }
    return { value: null, index: arr.length };
}
