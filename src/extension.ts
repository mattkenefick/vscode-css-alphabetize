import * as vscode from 'vscode';
import alphabetize from './functions/alphabetize';

/**
 * Extension activated
 *
 * @param ExtensionContract context
 * @return void
 */
export function activate(context: vscode.ExtensionContext) {
    let disposable;

    // region: Commands
    // ---------------------------------------------------------------------------

	disposable = vscode.commands.registerCommand('css-alphabetize.alphabetize', () => alphabetize());
	context.subscriptions.push(disposable);

    // endregion: Commands

}

// this method is called when your extension is deactivated
export function deactivate() {}
