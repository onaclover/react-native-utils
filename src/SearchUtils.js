/**
 * @providesModule RNUtils.SearchUtils
 */

import Singleton from 'singleton';
import _ from 'lodash';

const KEYWORD_TRUNK_LENGTH = 3;

class SearchUtils extends Singleton {
  constructor() {
    super();
    this.buildSanitizedDict();
  }

  buildSanitizedDict() {
    const vietnameseChars = require('./data/vietnamese_chars.json');
    const splited = _.map(vietnameseChars, (unicode, ascii) => ({ [ascii]: unicode.split('') }));
    this.sanitizedDict = Object.assign(...splited);
  }

  buildSearchPattern(keyword, trunkLength) {
    const sanitized = this.sanitize(keyword);
    const trunks = this.breakKeywordToTrunks(sanitized, trunkLength);
    
    return trunks.length <= 1
      ? RegExp(trunks.join(''))
      : RegExp(`(${trunks.join('|')})`);
  }

  breakKeywordToTrunks(keyword, trunkLength = KEYWORD_TRUNK_LENGTH) {
    if (keyword == null || keyword === '' || typeof(keyword) !== 'string')
      return [''];

    const stripped = keyword.replace(/[^a-z0-9]/g, '');
    if (stripped.length < trunkLength) return [stripped];

    return _.range(stripped.length - trunkLength + 1).map(start => (
      stripped.slice(start, start + trunkLength)
    ));
  }

  sanitize(text, removePunctuations = true) {
    if (_.isEmpty(text) || typeof(text) !== 'string') return '';

    const asciiText = text.toLowerCase()
      .split('')
      .map(this.convertUnicodeToAscii)
      .join('');

    if (!removePunctuations) return asciiText;
    return asciiText.replace(/[^a-z0-9\s]/g, '').replace(/\s{2,}/g, ' ');
  }

  convertUnicodeToAscii = unicode => (
    _.findKey(this.sanitizedDict, unicodes => unicodes.indexOf(unicode) >= 0) || unicode
  );
}

export default SearchUtils.get();
