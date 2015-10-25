/**
 * Transactions Module
 */

var transactions = (function transactions(app) {
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
