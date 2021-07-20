
import * as vscode from 'vscode';
import sortCssBlock from './sort-css-block';
import VsCodeHelper from '../utility/vscode-helper';

/**
 * Alphabetize CSS properties in VSCode environment
 *
 * @return void
 */
export default function alphabetize() {
    const editor = vscode.window.activeTextEditor;
    let selections: vscode.Selection[] = editor?.selections || [];

    // Default to the entire document
    if (VsCodeHelper.nothingIsSelected()) {
        selections = VsCodeHelper.selectAll();
    }

    // Filter all selections through CSS Block function
    VsCodeHelper.replaceSelections(selections, sortCssBlock);
}
