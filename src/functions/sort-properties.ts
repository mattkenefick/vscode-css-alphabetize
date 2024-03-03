import Helper from '../utility/vscode-helper';

/**
 * Identify, split, and sort CSS properties from within a string. Our
 * parameters are key/values split by a colon, the delimited by either
 * a semi-colon, line break, or closing bracket.
 *
 * @todo We shouldn't return 'any'. We should create an interface.
 * @todo Improve our initial clean-up lines.
 *
 * @param string properties
 * @param number defaultIndentation
 * @return any
 */
export default function sortProperties(properties: string, defaultIndentation: number = 4) {
	// Remove preceeding new lines
	properties = properties.replace(/^(\n)+/g, '');

	// Convert tabs to spaces (for consistent indentation)
	properties = properties.replace(/\t/g, ' '.repeat(defaultIndentation));

	// Inherit indentation from the first line
	const indentation: number = (properties.match(/^\s+/g) || [''])[0].length;
	const tab: string = ' '.repeat(indentation);

	// Find and temporarily remove comment blocks
	let commentBlocks = [...properties.matchAll(/\/\*([^*\/]+)\*\//gim)];
	commentBlocks.forEach((block) => (properties = properties.replace(block[0], '')));

	Helper.log('Comment Blocks: ' + JSON.stringify(commentBlocks));

	// Clean up space between single line properties
	properties = properties.replace(/;\s+(?=[a-zA-Z])/g, ';\n');

	// Extract properties from CSS string and sort them (non-commented)
	// const matches = [...properties.matchAll(/([$_a-zA-Z\-]+)\s{0,}:[^;\n}]+([^,][;\n}])/gm)].map(x => x[0].trim());
	// const matches = [...properties.matchAll(/([$_a-zA-Z\-]+)\s{0,}:\s*(.+?);\s/gm)].map((x) => x[0].trim());
	// let matches = [...properties.matchAll(/^(?!.*(?:\/\/|\/\*|\*)).+?([$_a-zA-Z\-]+)\s{0,}:\s*(.+?);\s/gm)].map((x) => x[0].trim());
	// let matches = [...properties.matchAll(/^(?!.*(?:\/\/|\/\*|\*)).+?((?:@include )|(?:[$_a-zA-Z\-]+)\s{0,}:\s*)(.+?);\s/gm)].map((x) => x[0].trim());
	let matches = [...properties.matchAll(/^(?!\s+(?:\/\/|\/\*|\*)).+?((?:@include )|(?:[$_a-zA-Z\-]+)\s{0,}:\s*)(.+?);\s/gm)].map((x) => x[0].trim());

	Helper.log('Matches: ' + JSON.stringify(matches));

	// Sort properties but put things like "border" before "border-left"
	matches.sort((a: string, b: string) => {
		a = a.split(':')[0];
		b = b.split(':')[0];
		a = a.toLowerCase().replace(/[^@a-z-]+/g, '');
		b = b.toLowerCase().replace(/[^@a-z-]+/g, '');
		return a.localeCompare(b);
	});

	// Erase all properties, retain our #key markers at end of line
	matches.forEach((match) => (properties = properties.replace(match, '')));

	// Erase double lines from
	properties = properties.replaceAll(/\n\s+$/gm, '');

	// Newly created CSS property block
	let block: string = tab + matches.join(`\n${tab}`).trim() + (properties ? '\n' + properties : '');

	// Add commented blocks back
	commentBlocks.forEach((commentBlock) => (block += `\n${tab}` + commentBlock[0].trim()));

	// Return block and indentation information
	return { block, indentation, tab };
}
