import * as vscode from 'vscode';

const output = vscode.window.createOutputChannel('CSS Alphabetize');

/**
 * @class VsCodeHelper
 */
export default class VsCodeHelper {
	/**
	 * @param string message
	 * @return void
	 */
	public static log(message: string): void {
		output.appendLine(message);
	}

	/**
	 * Check if nothing is selected; normal caret position
	 *
	 * @return boolean
	 */
	public static nothingIsSelected(): boolean {
		const editor = vscode.window.activeTextEditor;
		const document: vscode.TextDocument | undefined = editor?.document;
		let selections: vscode.Selection[] | undefined = editor?.selections;

		// Default to the entire document
		return !!(selections && selections.length <= 1 && selections[0].start.line === selections[0].end.line);
	}

	/**
	 * Replace selections with string or functio
	 *
	 * @param vscode.Selection[] selections
	 * @param string|function replacement
	 * @return void
	 */
	public static replaceSelections(selections: vscode.Selection[], replacement: any): void {
		const editor = vscode.window.activeTextEditor;
		const document: vscode.TextDocument | undefined = editor?.document;

		// Exit if we don't have the references we need
		if (!editor || !document || !selections) {
			console.warn('Exiting because we dont have something');
			return;
		}

		// Iterate and replace selections
		selections.forEach((selection) => {
			const range: vscode.Range = new vscode.Range(selection.start, selection.end);
			const text: string = document.getText(range);
			const replacementStr: string = typeof replacement === 'string' ? replacement : replacement(text);

			editor.edit((editBuilder: vscode.TextEditorEdit): void => {
				editBuilder.replace(selection, replacementStr);
			});
		});
	}

	/**
	 * mk: I'm sure there's a better way to do this.
	 *
	 * @return vscode.Selection[]
	 */
	public static selectAll(): vscode.Selection[] {
		let selections: vscode.Selection[] = [];

		selections.push(new vscode.Selection(new vscode.Position(0, 0), new vscode.Position(99999, 9999)));

		return selections;
	}
}
