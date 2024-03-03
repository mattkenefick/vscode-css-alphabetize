/**
 * Find nearest and deepest CSS block starting from the beginning.
 * Eventually we will have none left.
 *
 * @todo This function could be better
 *
 * @param string css
 * @param string openingBracket
 * @param string closingBracket
 * @param number indexStart
 * @return string
 */
export default function findNearestBlock(css: string, openingBracket: string = '{', closingBracket: string = '}', indexStart: number = 0): string {
	let currentIndex: number = indexStart;
	let oPos: number = 0;
	let oPosTmp: number = 0;
	let cPos: number = Infinity;

	// If the opening bracket exists and is less than the next closing bracket
	while (oPos > -1 && oPos < cPos) {
		oPosTmp = css.indexOf(openingBracket, currentIndex);
		cPos = css.indexOf(closingBracket, currentIndex);

		// Opening bracket in front of closing bracket
		if (oPosTmp < cPos && oPosTmp > -1) {
			oPos = oPosTmp;
		} else {
			break;
		}

		currentIndex = oPosTmp + 1;
	}

	// + 1 goes inside the bracket
	// - 1 excludes trailing bracket
	css = css.substring(oPos + 1, cPos);

	return css;
}
