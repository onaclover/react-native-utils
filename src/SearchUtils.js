/**
 * @providesModule RNUtils.SearchUtils
 * @flow
 */

import Singleton from 'singleton';
import _ from 'lodash';

const KEYWORD_TRUNK_LENGTH = 3;

class SearchUtils extends Singleton {
  constructor() {
    super();
    this.sanitizedDict = this.buildSanitizedDict();
  }

  buildSanitizedDict() {
    const vietnameseChars = require('../data/vietnamese_chars.json');

    const sections = _.map(vietnameseChars, (ascii, unicode) => {
      const unicodeChars = unicode.split('');
      const asciiChars = _.fill(Array(unicode.length), ascii);
      return _.zipObject(unicodeChars, asciiChars);
    });

    return Object.assign({}, ...sections);
  }

  buildSearchPattern(keyword: string, trunkLength: number): RegExp {
    const sanitized = this.sanitize(keyword);
    const trunks = this.breakKeywordToTrunks(sanitized, trunkLength);
    
    return trunks.length <= 1
      ? RegExp(trunks.join(''))
      : RegExp(`(${trunks.join('|')})`);
  }

  breakKeywordToTrunks(keyword: string, trunkLength = KEYWORD_TRUNK_LENGTH): Array<string> {
    if (keyword == null || keyword === '' || typeof(keyword) !== 'string')
      return [''];

    const stripped = keyword.replace(/[^a-z0-9]/g, '');
    if (stripped.length < trunkLength) return [stripped];

    return _.range(stripped.length - trunkLength + 1).map(start =>
      stripped.slice(start, start + trunkLength)
    );
  }

  sanitize(text: string, removePunctuations: boolean = true) {
    if (text == null || text === '' || typeof(text) !== 'string')
      return '';

    const asciiText = text.toLowerCase()
      .split('')
      .map(origin => this.sanitizedDict[origin] || origin)
      .join('');

    if (!removePunctuations) return asciiText;
    return asciiText.replace(/[^a-z0-9\s]/g, '').replace(/\s{2,}/g, ' ');
  }
}

export default SearchUtils.get();
