import { get } from '@ember/object';
import { computed } from '@ember/object';

/**
 * CP macro that listens to dependent (external) property, but allows overriding it locally without violating DDAU
 * By using a simple setter it will still trigger on changes of the dependent property even when being set before.
 *
 * @method
 * @return {boolean}
 * @param {string} dependentKey
 * @param {*} defaultValue
 * @private
 */
export default function(dependentKey: string, defaultValue: any = null) {
  return computed(dependentKey, {
    get() {
      return (get(this, dependentKey) === undefined ? defaultValue : get(this, dependentKey));
    },
    set(_key, value) { // eslint-disable-line no-unused-vars
      return value;
    }
  });
}
