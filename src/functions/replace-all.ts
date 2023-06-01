/**
 * String.prototype.replaceAll() polyfill
 * https://gomakethings.com/how-to-replace-a-section-of-a-string-with-another-one-with-vanilla-js/
 * @author Chris Ferdinandi
 * @license MIT
 */
export default function replaceAll(str: string, find: string|RegExp, replace: string){
    // If a regex pattern
    if (Object.prototype.toString.call(find).toLowerCase() === '[object regexp]') {
        return str.replace(find, replace);
    }

    // If a string
    return str.replace(new RegExp(find, 'g'), replace);
};
