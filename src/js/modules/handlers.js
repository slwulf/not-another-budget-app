/**
 * Event Handlers
 */

var handlers = (function handlers(app) {

  /**
   * DOM Event Listeners
   */

  var add_transaction = document.getElementById('add_transaction');

  add_transaction.addEventListener('click', function(e) {
    var desc = document.getElementById('add_description');
    var cat = document.getElementById('add_category');
    var amt = document.getElementById('add_amount');
    var el = e.target || e.srcElement;

    if (el && el.id === 'add_save') {
      e.preventDefault();

      transactions.add({
        description: desc.value,
        category: cat.value,
        amount: parseInt(amt.value, 10)
      });
    }
  });

  // Listeners on dynamically added elements
  document.addEventListener('click', function(event) {
    event = event || window.event;

    var el = event.target || event.srcElement;
    var parent = el.parentNode;

    var isTransaction =
      (el.classList.contains('transaction') ||
      parent.classList.contains('transaction'));

    var target;
    var dataId;

    if (el) {
      // Transactions
      if (isTransaction) {
        target = el.classList.contains('transaction') ? el : parent;
        dataId = el.dataset.id || parent.dataset.id;
        showEditPanel(dataId, target);
      }
    }
  }, true);

  /**
   * App Event Listeners
   */

  events.on('addTransaction', function(tran) {
    var tmp = template.get('transaction');
    template.render(tmp, tran);
  });

  /**
   * Event Handlers
   */

  function showEditPanel(data, elem) {
    var id = parseInt(data, 10);
    var panel = template.get('transaction-edit');
    var model = transactions.get(id);
    var rendered = template.render(panel, model, false);

    console.log(elem);
    console.log(rendered);
  }

})(state);
