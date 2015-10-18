/*
 * Budget
 * v 0.0.1
 *
 * This is a budget tracking app. It
 * can do the following things:
 *
 *   - Create, delete, edit, and list
 *     transaction data
 *   - Display various (customizable?)
 *     reports about transactions
 *   - Set and keep track of a budget
 *     with customizable categories
 *   - Sync data to a database (Node endpoint)
 *   - Load historical data from database (Node endpoint)
 *
 * It will use event-based architecture
 * for rendering data in the DOM to allow
 * live-updating lists and reports.
 */

// Modules
//
// Data/Model
// - What is a transaction?
// - Transaction CRUD
//
// Rendering/View
// - Template creation
// - DOM manipulation

(function() {

/**
 * State
 */

var state = {};

/**
 * Data Module
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
   * @param {String} category Groups the transaction
   * @return {Object} model A new Transaction object.
   */

  var Transaction = function Transaction(obj) {
    var model = {
      id: obj.id || 0,
      description: obj.description || 'transaction',
      amount: obj.amount || 0,
      category: obj.category || 'Default',
      date: obj.date || Date.now()
    };

    return model;
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
      console.warn('addTransaction: Could not create transaction with id', id);
    }

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
    if (!id) {
      return transactions[transactions.length - 1];
    }

    // return false if called w/ NaN or []
    if (isNaN(id) || typeof id !== 'number') {
      console.warn('getTransaction:', id, 'is not a number.');
      return false;
    }

    // Try to find the transaction.
    get = transactions.filter(function(tran) {
      return tran.id === id;
    });

    if (!get[0]) {
      // No transaction found.
      console.log('getTransaction: No transaction found for id', id);
      return false;
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
      console.warn('editTransaction:', id, 'is not a number.');
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

    return transaction;
  };

  /**
   * Deletes a transaction by ID
   * @param {Number} id Unique ID of the transaction
   */

  var deleteTransaction = function deleteTransaction(id) {
    var index;

    if (isNaN(id) || typeof id !== 'number') {
      console.warn('deleteTransaction:', id, 'is not a number.');
      return false;
    }

    // First, get the transaction's index
    index = transactions.map(function(e) {
      return e.id;
    }).indexOf(id);

    // Return the deleted element
    return transactions.splice(index, 1)[0];
  };

  /**
   * Public Methods
   */

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

})(state);

})();
