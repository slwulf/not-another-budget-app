/**
 * Budget Module
 */

var budget = (function budget(app) {
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
