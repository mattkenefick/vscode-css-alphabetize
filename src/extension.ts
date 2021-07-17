import * as vscode from 'vscode';

/**
 * @author Matt Kenefick <polymermallard.com>
 */

/**
 * String.prototype.replaceAll() polyfill
 * https://gomakethings.com/how-to-replace-a-section-of-a-string-with-another-one-with-vanilla-js/
 * @author Chris Ferdinandi
 * @license MIT
 */
function replaceAll(str: string, find: string|RegExp, replace: string){
    // If a regex pattern
    if (Object.prototype.toString.call(find).toLowerCase() === '[object regexp]') {
        return str.replace(find, replace);
    }

    // If a string
    return str.replace(new RegExp(find, 'g'), replace);

};

/**
 * Extension activated
 *
 * @param ExtensionContract context
 * @return void
 */
export function activate(context: vscode.ExtensionContext) {
    let disposable;

    const settings = vscode.workspace.getConfiguration('css-alphabetize');
    const OPENING_BRACKET: string = settings?.opening_bracket || '{';
    const CLOSING_BRACKET: string = settings?.closing_bracket || '}';

    /**
     * Find nearest and deepest CSS block starting from the beginning.
     * Eventually we will have none left.
     *
     * @todo This function could be better
     *
     * @param string css
     * @param number indexStart
     * @return string
     */
    function findNearestBlock(css: string, indexStart: number = 0): string {
        let currentIndex: number = indexStart;
        let oPos: number = 0;
        let oPosTmp: number = 0;
        let cPos: number = Infinity;

        // If the opening bracket exists and is less than the next closing bracket
        while (oPos > -1 && oPos < cPos) {
            oPosTmp = css.indexOf(OPENING_BRACKET, currentIndex);
            cPos = css.indexOf(CLOSING_BRACKET, currentIndex);

            // Opening bracket in front of closing bracket
            if (oPosTmp < cPos && oPosTmp > -1) {
                oPos = oPosTmp;
            }
            else {
                break;
            }

            currentIndex = oPosTmp + 1;
        }

        // + 1 goes inside the bracket
        // - 1 excludes trailing bracket
        css = css.substring(oPos + 1, cPos);

        return css;
    }

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
    function sortProperties(properties: string, defaultIndentation: number = 4) {
        // Remove preceeding new lines
        properties = properties.replace(/^(\n)+/g, '');

        // Convert tabs to spaces
        properties = properties.replace(/\t/g, ' '.repeat(defaultIndentation));

        // Inherit indentation from the first line
        const indentation: number = (properties.match(/^\s+/g) || [''])[0].length;
        const tab: string = ' '.repeat(indentation);

        // Extract properties from CSS string and sort them
        const matches = [...properties.matchAll(/([a-zA-Z\-]+)\s{0,}:[^;\n}]+([;\n}])/gm)].map(x => x[0]);
        matches.sort();

        // Erase all properties, retain our #key markers at end of line
        matches.forEach(match => properties = properties.replace(match, ''));

        // Newly created CSS property block
        const block: string = tab + matches.join('\n' + tab) + '\n' + properties;

        // Return block and indentation information
        return { block, indentation, tab };
    }

    /**
     * Process a selection of CSS
     *
     * @todo Improve our post cleanup and autoformatting
     *
     * @param string css
     * @return string
     */
    function processCss(css: string): string {
        let blocks = [];
        let match;
        const identifiedIndentation = (css.match(/(^ +)/m) || ['    '])[0].length;

        // Extract all blocks into an array
        while (css.indexOf(OPENING_BRACKET, 0) > -1) {
            const key: number = blocks.length;
            const block: string = findNearestBlock(css);

            blocks.push(block);

            // Save position marker that we can defer to later for replacement
            css = css.replace(`{${block}}`, `#${key}`);
        }

        // Iterate through key markers
        do {
            if (match = css.match(/(?:#)(\d)/)) {
                const index: number = parseFloat(match[1]);
                const props = sortProperties(blocks[index]);
                const closingIndentation = ' '.repeat(Math.max(0, props.indentation - identifiedIndentation));
                css = css.replace('#' + match[1], `{\n${props.block}\n${closingIndentation}}\n\n`);
            }
        } while (match);

        // Consecutive empty lines
        css = replaceAll(css, /(?:\s+\n){1,}(\s+\n)/gm, '$1\n');

        // Empty lines with a bracket
        css = replaceAll(css, /(?:\s+\n){1,}( +)?}/gm, '\n$1}');

        return css;
    }

    // Core function
    function alphabetize() {
        const editor = vscode.window.activeTextEditor;
        const document: vscode.TextDocument | undefined = editor?.document;
        let selections: vscode.Selection[] | undefined = editor?.selections;

        // Default to the entire document
        if (selections && selections.length === 0 && selections[0].start.line === selections[0].end.line) {
            selections.unshift(new vscode.Selection(
                new vscode.Position(0, 0),
                new vscode.Position(99999, 9999),
            ));
        }

        // Exit if we don't have the references we need
        if (!editor || !document || !selections) {
            return;
        }

        // Iterate through all selections for replacement
        selections.forEach(selection => {
            const text: string = document.getText(new vscode.Range(selection.start, selection.end));
            const newCss: string = processCss(text);

            // Replace selection
            editor.edit((editBuilder: vscode.TextEditorEdit): void => {
                let replacementText: string = newCss;

                // Replace selection with manipulated text
                editBuilder.replace(selection, replacementText);
            });
        });

    }


    // region: Commands
    // ---------------------------------------------------------------------------

	disposable = vscode.commands.registerCommand('css-alphabetize.alphabetize', () => alphabetize());
	context.subscriptions.push(disposable);

    // endregion: Commands

}

// this method is called when your extension is deactivated
export function deactivate() {}
