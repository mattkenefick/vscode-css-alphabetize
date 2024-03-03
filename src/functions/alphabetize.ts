import * as vscode from 'vscode';
import sortCssBlock from './sort-css-block';
import vsCodeHelper from '../utility/vscode-helper';

/**
 * Alphabetize CSS properties in VSCode environment
 *
 * @return void
 */
export default function alphabetize() {
	const editor = vscode.window.activeTextEditor;
	let selections: vscode.Selection[] = editor?.selections || [];

	// Default to the entire document
	if (vsCodeHelper.nothingIsSelected()) {
		selections = vsCodeHelper.selectAll();
	}

	// Filter all selections through CSS Block function
	vsCodeHelper.replaceSelections(selections, sortCssBlock);
}
