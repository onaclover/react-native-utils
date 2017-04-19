/**
 * @providesModule RNUtils.Extensions
 */

export default class Extensions {
  static deepFreeze(obj) {
    if (obj == null || typeof(obj) !== 'object')
      return;
    
    Object.keys(obj).forEach(key => Extensions.deepFreeze(obj[key]));
    Object.freeze(obj);
  }

  static nap(time) {
    if (time <= 0) return;
    return new Promise(resolver => setTimeout(resolver, time));
  }
}
