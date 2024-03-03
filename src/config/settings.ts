import * as vscode from 'vscode';

/**
 * @object Settings
 */
export default class Settings {
	/**
	 * Get closing bracket from settings or return closing curly brace
	 *
	 * @return string
	 */
	public static get closingBracket(): string {
		return this.configuration?.closing_bracket || '}';
	}

	/**
	 * @todo memoize
	 *
	 * @return object
	 */
	public static get configuration() {
		return vscode.workspace.getConfiguration('css-alphabetize') || {};
	}

	/**
	 * Get opening bracket from settings or return opening curly brace
	 *
	 * @return string
	 */
	public static get openingBracket(): string {
		return this.configuration?.opening_bracket || '{';
	}
}
