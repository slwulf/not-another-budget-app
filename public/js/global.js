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

  $(document).ready(function() {
    var $transactions = $('.transaction');
    $transactions
      .on('input', '[contenteditable="true"]',
      debounce(editTransaction, 500));
  });

})(jQuery);