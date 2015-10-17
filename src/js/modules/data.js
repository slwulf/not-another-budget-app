/**
 * Data Module
 */

var data = (function(app) {

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
    var transaction;
    var id;

    // Get new ID
    if (app.transactions.length) {
      id = app.transactions[app.transactions.length].id + 1;
    } else {
      id = 1;
    }

    // Instantiate a new transaction.
    transaction = Transaction({
      id: id,
      description: desc,
      amount: amt,
      category: cat
    });

    // ID should always match
    if (id === transaction.id) {
      app.transactions.push(transaction);
    } else {
      console.warn('addTransaction: Could not create transaction with id', id);
    }
  };

  /**
   * Retrieves transaction data by ID
   * @param {Number} id Unique ID of the transaction
   * @return {Object} A stored transaction object
   */

  var getTransaction = function getTransaction(id) {
    var transaction;

    if (isNaN(id) || typeof id !== 'number') {
      console.warn('getTransaction:', id, 'is not a number.');
      return false;
    }

    // Try to find the transaction.
    transaction = app.transactions.filter(function(tran) {
      return tran.id === id;
    });

    // If we find any transactions, return them.
    if (transaction.length > 1) return transaction;
    return transaction[0];

    // Otherwise, let the developer know.
    console.log('getTransaction: No transaction found for id', id);
    return false;
  };

  /**
   * Updates a transaction by ID and returns the transaction
   * @param {Number} id Unique ID of the transaction
   * @param {Object} n Changes to the transaction
   * @return {Object} The updated transaction
   */

  var editTransaction = function editTransaction(id, n) {
    if (isNaN(id) || typeof id !== 'number') {
      console.warn('editTransaction:', id, 'is not a number.');
      return false;
    }

    // First, get the transaction's index
    var index = state.transactions.map(function(e) {
      return e.id;
    }).indexOf(id);

    // Next, get a reference and alter it
    var transaction = state.transactions[index];
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
    if (isNaN(id) || typeof id !== 'number') {
      console.warn('deleteTransaction:', id, 'is not a number.');
      return false;
    }

    // First, get the transaction's index
    var index = state.transactions.map(function(e) {
      return e.id;
    }).indexOf(id);

    // Return the deleted element
    return state.transactions.splice(index, 1)[0];
  };

  /**
   * Public Methods
   */

  return {
    add: addTransaction,
    get: getTransaction,
    edit: editTransaction,
    remove: deleteTransaction
  };

})(state);
