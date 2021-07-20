import * as assert from 'assert';
import replaceAll from '../../functions/replace-all';

suite('Replace All', () => {
	test('Character replacement', () => {
        let input: string = 'abcdefffg';
        let output: string = replaceAll(input, 'f', 'm');
        const expect: string = 'abcdemmmg';

		assert.strictEqual(output, expect);
	});


	test('Regex word replacement', () => {
        const input: string = 'abcde test test test g';
        const output: string = replaceAll(input, /(test\s?)/gm, '');
        const expect: string = 'abcde g';

		assert.strictEqual(output, expect);
	});
});
