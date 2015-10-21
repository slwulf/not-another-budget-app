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
//
// OMG SERVER LAYER!
// - store 5 or 10 or x most recently added records
//   in localStorage and sync to server when limit
//   is reached
// - if limit is reached and server times out, allow
//   limit to be exceeded for next limit / 2 records,
//   then retry sync
// - ta-da! offline-friendly app

(function(window, document) {

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

/**
 * Transactions Module
 */

var transactions = (function(app) {
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
   * @return {Object} The added transaction
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
      return undefined;
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

    if (index < 0) {
      console.warn('No transaction found for id', id);
      return undefined;
    }

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
   * @return {Object} The deleted transaction
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
   * @return {Number} The total for category or all transactions
   */

  var getTotal = function getTotal(category) {
    return transactions.reduce(function(amt, t){
      if (category) {
        if (category === t.category) return amt += t.amount;
        return amt;
      }

      return amt += t.amount;
    }, 0);
  };

  /**
   * Public Methods
   */

  if (app.isTest) {
    return {
      add: addTransaction,
      get: getTransaction,
      edit: editTransaction,
      remove: deleteTransaction,
      total: getTotal,
      length: function length() {
        return transactions.length;
      },
      all: function all() {
        return transactions;
      }
    };
  }

  return {
    remove: deleteTransaction,
    add: addTransaction,
    get: getTransaction,
    edit: editTransaction,
    total: getTotal,
    length: function length() {
      return transactions.length;
    }
  };

})(state);

/**
 * Budget Module
 */

var budget = (function(app) {
  /**
   * Budgets list
   */

  var budgets = [];

  /**
   * Budget Model
   * @param {Number} id Unique identifier
   * @param {String} category Which category of transaction to track
   * @param {Number} amount Total amount allowed to spend
   */

  var Budget = function Budget(obj) {
    return {
      id: obj.id || 0,
      category: obj.category || 'Default',
      amount: obj.amount || 0
    };
  };

  /**
   * Adds a new budget to the list
   * @param {Object} data Budget properties
   * @return {Object} The added budget
   */

  var addBudget = function addBudget(data) {
    var cat = data.category;
    var amt = data.amount;
    var last = budgets[budgets.length - 1];
    var id = (last) ? last.id + 1 : 1;
    var budget = Budget({
      id: id,
      category: cat,
      amount: amt
    });

    // Check if it already exists
    var alreadyExists = getBudget(cat);
    if (alreadyExists) {
      console.warn('Budget for ', cat, ' already exists.');

      // Return existing budget
      return alreadyExists;
    }

    // ID should always match
    if (id === budget.id) {
      budgets.push(budget);
    } else {
      console.warn('Could not create budget with id', id);
      return undefined;
    }

    events.trigger('addBudget', budget);
    return budget;
  };

  /**
   * Retrieves budget info by name
   * @param {String} name Category name
   * @return {Object} The requested budget
   */

  var getBudget = function getBudget(name) {
    var get;

    // If no name passed, get most recent
    if (name === undefined) {
      return budgets[budgets.length - 1];
    }

    // look up the budget
    get = budgets.filter(function(budget) {
      return budget.category === name;
    });

    if (!get[0]) {
      // No budget found.
      console.warn('No budget found for name', name);
      return undefined;
    }

    return get[0];
  };

  /**
   * Updates a budget by category
   * @param {String} name Category name
   * @param {Object} n Changes to the budget
   * @return {Object} The updated budget
   */

  var editBudget = function editBudget(name, n) {
    var index = budgets.map(function(b) {
      return b.category;
    }).indexOf(name);
    var budget;

    if (index < 0) {
      console.warn('No budget found for name', name);
      return undefined;
    }

    budget = budgets[index];
    if (n.category) budget.category = n.category;
    if (n.amount) budget.amount = n.amount;

    events.trigger('editBudget', budget);
    return budget;
  };

  /**
   * Deletes a budget by category
   * @param {String} name Category name
   * @return {Object} The deleted budget
   */

  var deleteBudget = function deleteBudget(name) {
    var index = budgets.map(function(budget) {
      return budget.category;
    }).indexOf(name);
    var budget;

    if (index < 0) {
      console.warn('No transaction found for name', name);
      return undefined;
    }

    budget = budgets.splice(index, 1)[0];
    events.trigger('deleteBudget', budget);
    return budget;
  };

  /**
   * Compares transactions to budget category
   * @param {String} name Category name
   * @return {Boolean} Returns true if category is over budget
   */

  var isOverBudget = function isOverBudget(name) {
    var budget = getBudget(name).amount;
    var spent = transactions.total(name);

    if (budget && spent) return spent > budget;
    return false;
  };

  /**
   * Public Methods
   */

  if (state.isTest) {
    return {
      add: addBudget,
      get: getBudget,
      edit: editBudget,
      remove: deleteBudget,
      isOverBudget: isOverBudget,
      all: function all() {
        return budgets;
      }
    };
  }

  return {
    add: addBudget,
    get: getBudget,
    edit: editBudget,
    remove: deleteBudget,
    isOverBudget: isOverBudget
  };

})(state);

})(window, document);
