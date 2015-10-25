/**
 * Events Module
 */

var events = (function events(app) {
  /**
   * Events Object
   */

  var events = {};

  /**
   * Adds a new event listener
   * @param {String} eventName The name of the event
   * @param {Function} fn The event callback to add
   */

  var addEventListener = function addEventListener(eventName, fn) {
    events[eventName] = events[eventName] || [];
    events[eventName].push(fn);
  };

  /**
   * Removes an event listener
   * @param {String} eventName The name of the event
   * @param {Function} fn The event callback to remove
   */

  var removeEventListener = function removeEventListener(eventName, fn) {
    var i;
    if (events[eventName]) {
      for (i = 0; i < events[eventName].length; i++) {
        if (events[eventName][i] === fn) {
          events[eventName].splice(i, 1);
          break;
        }
      }
    }
  };

  /**
   * Triggers an event
   * @param {String} eventName The event to be triggered
   * @param {Object} data A data payload to pass to listeners
   */

  var triggerEvent = function triggerEvent(eventName, data) {
    if (events[eventName]) {
      events[eventName].forEach(function(fn) {
        fn(data);
      });
    }
  };

   /**
    * Public Methods
    */

  return {
    on: addEventListener,
    off: removeEventListener,
    trigger: triggerEvent
  };

})(state);
