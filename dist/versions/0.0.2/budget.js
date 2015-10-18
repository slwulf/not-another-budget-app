/*
 * Not Another Budget App
 * v 0.0.2
 *
 * What the hell am I doing...?
 *
 *   = MODULES =
 *
 *   - Transactions -
 *   Keeps track of and categorizes expenses
 *   RAGE API (remove, add, get, edit) (rage > crud)
 *     (to be refactored -> events w/ no API)
 *
 *   - Events -
 *   Global (to the app) events API
 *     .on(event, fn) Set event listener
 *     .off(event, fn) Remove event listener
 *     .trigger(event, data) Deliver data to listeners
 *
 *   - Render -
 *   DOM API... more details in render.js
 *
 * Transactions is the base data module.
 * Other data types will be built similarly:
 *   First, declare a model factory and a data set.
 *   Second, create stateless private functions to
 *     operate on the data. Data in, data out.
 *   Finally, expose an API and attach events.
 *   Write tests in conjunction.
 */

// Modules
//
// Events (done! except putting events everywhere)
//
// Data/Model
// - Transactions (done! except not really)
// - Budgets: tracks budget by category
//            sets category amts to set or %
// - Reports: calculates various stats based on
//              other modules
//
// Rendering/View
// - Template creation
// - DOM manipulation
//
// Routes
// - oh god am i really gonna do routes
// - yeah i guess i have to

(function() {

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

/**
 * Transactions Module
 *
 * Author's note: I got so tired of the
 *   word "transaction" by the end of
 *   writing this module that I wanted
 *   to rename the module something sane
 *   and simple like "purchases" or
 *   "expenses". But by that point, I
 *   was in too deep.
 *
 *   That's why this module will remain
 *   the data module until I refactor
 *   and can rename it something sane. Probably
 *   around the time I write the next data
 *   modules, which describe budgets & income.
 *
 *   Actually, income can probably be part of this
 *   module much more simply, without inheritance.
 *   Set default category to Income, expose diff
 *   UI for creating "Income" Transactions that does
 *   addTransaction() without a category definition.
 */

var data = (function(app) {
  /**
   * Transactions list
   */

  var transactions = [];

  /**
   * Transaction model
   * @param {Number} id Unique identifier
   * @param {String} description A short description or name
   * @param {Number} amount Amount of the transaction
   * @param {String} category Meta data
   * @param {Object} date Current date in ms
   * @return {Object} transaction A new Transaction object.
   */

  var Transaction = function Transaction(obj) {
    return {
      id: obj.id || 0,
      description: obj.description || 'transaction',
      amount: obj.amount || 0,
      category: obj.category || 'Default',
      date: obj.date || Date.now()
    };
  };

  /**
   * Adds a new transaction to the list
   * @param {Object} data Transaction properties
   */

  var addTransaction = function addTransaction(data) {
    var desc = data.description;
    var amt = data.amount;
    var cat = data.category;
    var last = transactions[transactions.length - 1];
    var id = (last) ? last.id + 1 : 1;
    var transaction = Transaction({
      id: id,
      description: desc,
      amount: amt,
      category: cat
    });

    // ID should always match
    if (id === transaction.id) {
      transactions.push(transaction);
    } else {
      console.warn('Could not create transaction with id', id);
    }

    events.trigger('addTransaction', transaction);
    return transaction;
  };

  /**
   * Retrieves transaction data by ID
   * @param {Number} id Unique ID of the transaction
   * @return {Object} A stored transaction object
   */

  var getTransaction = function getTransaction(id) {
    var get;

    // If no ID is passed, get most recent
    if (id === undefined) {
      return transactions[transactions.length - 1];
    }

    // return undefined if called w/ NaN or []
    if (isNaN(id) || typeof id !== 'number') {
      console.warn(id, 'is not a number.');
      return undefined;
    }

    // Try to find the transaction.
    get = transactions.filter(function(tran) {
      return tran.id === id;
    });

    if (!get[0]) {
      // No transaction found.
      console.warn('No transaction found for id', id);
      return undefined;
    }

    // Return as many transactions as are found
    return (get.length > 1) ? get : get[0];
  };

  /**
   * Updates a transaction by ID and returns the transaction
   * @param {Number} id Unique ID of the transaction
   * @param {Object} n Changes to the transaction
   * @return {Object} The updated transaction
   */

  var editTransaction = function editTransaction(id, n) {
    var index;
    var transaction;

    if (isNaN(id) || typeof id !== 'number') {
      console.warn(id, 'is not a number.');
      return false;
    }

    // First, get the transaction's index
    index = transactions.map(function(e) {
      return e.id;
    }).indexOf(id);

    // Next, get a reference and alter it
    transaction = transactions[index];
    if (n.description) transaction.description = n.description;
    if (n.amount) transaction.amount = n.amount;
    if (n.category) transaction.category = n.category;

    events.trigger('editTransaction', transaction);
    return transaction;
  };

  /**
   * Deletes a transaction by ID
   * @param {Number} id Unique ID of the transaction
   */

  var deleteTransaction = function deleteTransaction(id) {
    var index;
    var transaction;

    if (isNaN(id) || typeof id !== 'number') {
      console.warn(id, 'is not a number.');
      return undefined;
    }

    // First, get the transaction's index
    index = transactions.map(function(e) {
      return e.id;
    }).indexOf(id);

    if (index < 0) {
      console.warn('No transaction found for id', id);
      return undefined;
    }

    // Return the deleted element
    transaction = transactions.splice(index, 1)[0];
    events.trigger('deleteTransaction', transaction);
    return transaction;
  };

  /**
   * Returns the total spent for all transactions
   * or a given category
   * @param {String} category A category of transactions (optional)
   */

  var getTotal = function getTotal(category) {
    return transactions.reduce(function(amt, t){
      return amt += t.amount;
    }, 0);
  };

  /**
   * Public Methods
   */

   // Tests get all functions
  if (app.isTest) {
    return {
      add: addTransaction,
      get: getTransaction,
      edit: editTransaction,
      remove: deleteTransaction,
      all: function all() {
        return transactions;
      },
      length: function length() {
        return transactions.length;
      }
    };
  }

  // App gets subset
  return {
    length: function length() {
      return transactions.length;
    }
  };

})(state);

/**
 * Events Module
 */

var events = (function(app) {
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

})();
