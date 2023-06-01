import findNearestBlock from './find-nearest-block';
import replaceAll from './replace-all';
import sortProperties from './sort-properties';

/**
 * Process a selection of CSS
 *
 * @todo Improve our post cleanup and autoformatting
 *
 * @param string css
 * @param string openingBracket
 * @param string closingBracket
 * @return string
 */
export default function sortCssBlock(
	css: string,
	openingBracket: string = '{',
	closingBracket: string = '}',
): string {
    let blocks = [];
    let match;
	let previousCss;
    const identifiedIndentation = (css.match(/(^ +)/m) || ['    '])[0].length;

    // Extract all blocks into an array
    while (css.indexOf(openingBracket, 0) > -1) {
        const key: number = blocks.length;
        const block: string = findNearestBlock(css, openingBracket, closingBracket);

        blocks.push(block);

        // Save position marker that we can defer to later for replacement
        css = css.replace(`{${block}}`, `#!${key}`);
    }

    // Iterate through key markers
    do {
        if (match = css.match(/(?:#!)(\d+)/)) {
            const index: number = parseFloat(match[1]);
            const props = sortProperties(blocks[index]);
            const closingIndentation = ' '.repeat(Math.max(0, props.indentation - identifiedIndentation));
            css = css.replace('#!' + match[1], `{\n${props.block}\n${closingIndentation}}`);
        }
    } while (match);

	do {
		// Consecutive empty lines
		css = replaceAll(css, /(?:\s+\n){1,}(\s+\n)/gm, '$1');

		// Remove additional lines between blocks (issue #1)
		css = replaceAll(css, /((?:(.*) {))\n( +)(\n(?:(.*) {))/gm, '$1$4');

		// Empty lines with a bracket
		css = replaceAll(css, /(?:\s+\n){1,}( +)?}/gm, '\n$1}');
	} while (css !== previousCss && (previousCss = css));

    return css;
}
