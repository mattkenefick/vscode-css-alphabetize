import * as assert from 'assert';
import replaceAll from '../../functions/replace-all';

suite('Replace All', () => {
	test('Character replacement', () => {
        let input: string = 'abcdefffg';
        let output: string = replaceAll(input, 'f', 'm');

		assert.strictEqual(output, 'abcdemmmg');
	});


	test('Regex word replacement', () => {
        let input: string = 'abcde test test test g';
        let output: string = replaceAll(input, /(test\s?)/gm, '');

		assert.strictEqual(output, 'abcde g');
	});
});
