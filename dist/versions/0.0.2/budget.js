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

/**
 * Render Module
 */

var render = (function(app) {

  /**
   * Templates list
   */

  var templates = {};

  /**
   * Template model
   * @param {Element} node HTML Element
   * @param {Object} model Data model used by template
   * @param {Element} parent The parent node of the template
   */

  var Template = function Template(obj) {
    return {
      node: obj.node || document.createDocumentFragment(),
      model: obj.model || false,
      parent: obj.parent || document.body
    };
  };

  /**
   * Takes Elements with class name
   * @return {Array} An array of Template objects
   */

  var getTemplates = function getTemplates() {
    var nodes = document.getElementsByClassName('template');
    var keys = Object.keys(nodes);
    var len = keys.length;
    var newTemplate;
    var model;
    var clone;
    var node;
    var id;
    var i;

    // Loop through nodes array-like
    for (i = 0; i < len / 2; i++) {
      node = nodes[keys[i]];
      id = node.id;

      // Skip if template already exists
      if (templates.hasOwnProperty(id)) {
        node.remove();
        continue;
      }

      // Get template components
      clone = node.cloneNode(true);
      model = node.dataset ? node.dataset.model : false;
      parent = node.parentNode;

      // Setup clone classes
      clone.classList.remove('template');
      clone.classList.add(id);
      clone.removeAttribute('id');

      // Create a Template instance
      newTemplate = Template({
        node: clone,
        model: model,
        parent: parent
      });

      // Remove template from the DOM
      node.remove();

      // Add to list
      templates[id] = newTemplate;
    }
  };

  /**
   * Template string regex
   * Matches for any string like:
   *     _(arbitrary.text)
   */

  var isTemplateString = function isTemplateString(str) {
    var templateString = /_\(([a-z]*).([a-z]*)\)/gi;
    return templateString.test(str);
  };

  /**
   * Takes a template string like _(model.property)
   * and a model instance and returns the value
   * @param {String} tStr A template string
   * @param {Object} model An instance of a model to render
   * @return {String} The requested value
   */

  var parseTemplateString = function parseTemplateString(tStr, model) {
    // First, remove any _, (, and )
    var clean = tStr.replace(/[_\(\)]/g, '');

    // Next, split the string at .
    var parts = clean.split('.');

    // If nothing was split, return
    if (parts.length === 1) return parts[0];

    // Otherwise, get the key
    var key = parts[1];
    var data = model[key];

    // Assume dates are stored in ms & convert them
    var date;
    if (key === 'date') {
      date = new Date(data);
      return (date.getMonth() + 1) + '/' + date.getDate();
    }

    // Otherwise, return the requested value
    return model[key];
  };

  /**
   * Takes a DOM node and loops through
   * dataset and textContent for template strings
   * @param {Element} node The DOM node
   * @param {Object} model An instance of a model to render
   * @return {Element} The same DOM node, parsed
   */

  var parseNode = function parseNode(node, model) {
    var dataset = node.dataset;
    var children = node.children;

    var keys = Object.keys(dataset);
    var len = keys.length;
    var parsed;
    var child;
    var text;
    var data;
    var key;
    var i;

    // Parse any data attributes
    for (i = 0; i <= len; i++) {
      key = keys[i];
      data = dataset[key];

      if (isTemplateString(data)) {
        parsed = parseTemplateString(data, model);
        node.dataset[key] = parsed;
      }
    }

    // Parse any children
    for (i = 0, len = children.length; i < len; i++) {
      child = children[i];
      text = child.textContent;

      node.children[i].textContent = parseTemplateString(text, model);
    }

    // Return the altered node
    return node.cloneNode(true);
  };

  /**
   * Returns a cloned template from the list.
   * @param {String} name Name of the template to get
   * @return {Element} A cloned node
   */

  var getTemplate = function getTemplate(name) {
    return templates[name].node.cloneNode(true);
  };

  /**
   * Initialize
   */

  // Return test methods
  if (app.isTest) {
    return {
      isTemplateString: isTemplateString,
      parseTemplateString: parseTemplateString,
      all: function all() {
        return templates;
      }
    };
  }

  getTemplates();

  // This section is just for testing at the moment.
  // Will break out DOM and app event handlers into
  // a separate module.

  events.on('addTransaction', function(tran) {
    var newTran = parseNode(getTemplate('transaction'), tran);
    document.getElementById('main').appendChild(newTran);
  });

  transactions.add({
    description: 'test',
    amount: 4.35,
    category: 'Test'
  });

  transactions.add({
    description: 'another test',
    amount: 4.20,
    category: 'Test'
  });

  /**
   * Public Methods
   */

  return {
    get: getTemplate,
    parse: parseNode
  };

})(state);

})(window, document);
