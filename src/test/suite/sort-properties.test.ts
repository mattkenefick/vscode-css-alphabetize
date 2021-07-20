import * as assert from 'assert';
import sortProperties from '../../functions/sort-properties';

suite('Sort Properties', () => {
	test('Order indented properties', () => {
        const input: string = `
    display: block;
    color: red;
    background: blue;
`;
       const output: string = sortProperties(input).block.trim();
       const expect: string = `
    background: blue;
    color: red;
    display: block;
`.trim();

		assert.strictEqual(output, expect);
	});
});
