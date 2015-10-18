/**
 * State
 */

var state = {

  /**
   * Checks if runtime is node.
   * When true, all modules expose
   * all available functions.
   * @type {Boolean}
   */
  isTest: (typeof window === 'undefined')

};
