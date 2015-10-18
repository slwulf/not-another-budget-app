/**
 * State
 */

var state = (function (){
  var transactions = [];

  // TODO: This feels like a wrong thing...
  var updateState = function updateState(prop, obj) {
    // don't allow overwrite of this method
    if (prop === 'update') return false;

    // special update for transactions
    if (prop === 'transactions') {
      // If obj is array, concat list
      if (Array.isArray(obj)) {
        // Make sure it's an array of transactions
        if (!obj[0].hasOwnProperty('id')) return true;
        transactions = transactions.concat(obj);
      }

      // If it's a transaction obj, push
      if (obj.hasOwnProperty('id')) {
        transactions.push(obj);
      }

      // Otherwise, don't do anything.
      return false;
    }

    // var keys = Object.keys(obj);
    // keys.some(function(key) {
    //   this[key] = obj[key];
    // });
  };

  return {
    update: updateState,
    length: function length() {
      return transactions.length;
    },
    last: function last() {
      return transactions[transactions.length-1] || { id: 0 };
    },
    list: function list() {
      return transactions;
    }
  };
})();
