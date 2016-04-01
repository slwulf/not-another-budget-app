(function($) {

  /**
   * debounce
   *
   * Throttle the amount of times a given
   * function is called and executed.
   *
   * @param {Function} func The function to call
   * @param {Number} wait Time in ms to wait between calls
   * @param {Boolean} immed When true, execute func when
   *                        debounce executes
   */

  function debounce(func, wait, immed) {
    var timeout;
    return function() {
      var ctx = this;
      var args = arguments;
      var later = function() {
        timeout = null;
        if (!immed) func.apply(ctx, args);
      };

      var callNow = immed && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (immed) func.apply(ctx, args);
    };
  }

  /**
   * parseDate
   *
   * Parses a Date object into the format
   * m/d/yyyy
   *
   * @param {Object} date Date object
   * @return {String} date, formatted
   */

  function parseDate(date) {
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    return month + '/' + day + '/' + year;
  }

  /**
   * updateTransaction
   *
   * Given a transaction object, sends
   * a PUT request to the server to update
   * record at transaction.id
   *
   * @param {Object} transaction Field updates and an id
   * @param {Function} cb A callback to execute
   */

  function updateTransaction(transaction, cb) {
    var update = { id: transaction.id };
    var description = transaction.description;
    var category = transaction.category;
    var amount = transaction.amount;
    var date = transaction.date;
    var success = cb || function(x){console.log(x)};

    if (description) update.description = description;
    if (category) update.category = category;
    if (amount) update.amount = amount;
    if (date) update.date = date;

    $.ajax({
      method: 'PUT',
      url: '/api/transactions/update',
      data: update,
      dataType: 'json',
      success: success,
      error: function(err) {
        console.log(err);
      }
    });
  }

  /**
   * editTransaction
   *
   * Handles contenteditable input event
   * emitting from transaction fields
   *
   * @param {Object} event An event payload
   */

  function editTransaction(event) {
    var $event = $(event.target);
    var $transaction = $event.parents('.transaction');
    var id = $transaction.data('id');
    var key = $event.data('key');
    var value = $event.text();
    var transaction = { id: id };
    transaction[key] = value;

    updateTransaction(transaction);
  }

  /**
   * removeTransaction
   *
   * Handles click event emitting from
   * .transaction-remove button.
   *
   * @param {Object} event An event payload
   */

  function removeTransaction(event) {
    var $event = $(event.target);
    var $transaction = $event.parents('.transaction');
    var id = $transaction.data('id');

    $.ajax({
      method: 'DELETE',
      url: '/api/transactions/delete/' + id,
      success: function(data) {
        console.log(data.message);
        $transaction.slideUp(function() {
          $(this).remove();
        });
      },
      error: function(err) {
        console.log(err);
      }
    });
  }

  /**
   * updateBudget
   *
   * Given a budget object, send a
   * PUT request to the server to
   * update record at budget.id
   *
   * @param {Object} budget Field updates and an id
   * @param {Function} cb A callback function
   */

  function updateBudget(budget, cb) {
    var update = { id: budget.id };
    var category = budget.category;
    var amount = budget.amount;
    var success = cb || function(x){console.log(x)};

    if (category) update.category = category;
    if (amount) update.amount = amount;

    $.ajax({
      method: 'PUT',
      url: '/api/budgets/update',
      data: update,
      dataType: 'json',
      success: success,
      error: function(err) {
        console.log(err);
      }
    });
  }

  /**
   * editBudget
   *
   * Handles contenteditable input event
   * emitted from budget fields
   *
   * @param {Object} event An event payload
   */

  function editBudget(event) {
    var $event = $(event.target);
    var $budget = $event.parents('.budget');
    var id = $budget.data('id');
    var key = $event.data('key');
    var value = $event.text();
    var budget = { id: id };
    budget[key] = value;

    updateBudget(budget);
  }

  $(document).ready(function() {
    var $transactions = $('.transaction');
    var $budgets = $('.budget');

    $transactions
      .on('input', '[contenteditable="true"]',
        debounce(editTransaction, 500))
      .on('click', '.transaction-remove',
        removeTransaction);

    $budgets
      .on('input', '[contenteditable="true"]',
        debounce(editBudget, 500));

    $('#set-date').on('submit', function(event) {
      event.preventDefault();
      var $event = $(event.target);
      var $input = $event.find('[name="current-date"]');
      var date = $input.val().trim();
      var root = window.location.origin;

      if (~window.location.pathname.indexOf('budgets')) root += '/budgets';

      if (date.length < 7) return window.location.href = root;
      window.location.href = root + '/date/' + date;
    });

    $('.category-links').each(function() {
      var $this = $(this);
      var url = $this.attr('href');
      var date = $('[name="current-date"]').val();

      $this.attr('href', '/date/' + date + '/' + url);
    });
  });

})(jQuery);
