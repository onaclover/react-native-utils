/**
 * @providesModule RNUtils.ValidationUtils
 */

import Singleton from 'singleton';
import _ from 'lodash';

const EMAIL = 'email';
const PASSWORD = 'password';

const PATTERNS = {
  [EMAIL]: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/ig,
  [PASSWORD]: /^[\w\d\s!@#$%^&*]{8,20}$/ig,
};

export const DATA_TYPES = { EMAIL, PASSWORD };

class ValidationUtils extends Singleton {
  validate(inputData, dataType, { forEmpty, forInvalid } = {}) {
    if (_.isEmpty(inputData))
      return forEmpty;

    const pattern = PATTERNS[dataType];
    if (pattern == null)
      return forInvalid;

    const matches = inputData.match(pattern);

    if (matches == null || matches[0] !== inputData)
      return forInvalid;

    return null;
  }
}

export default ValidationUtils.get();
