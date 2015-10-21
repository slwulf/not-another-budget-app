/**
 * Transactions Module Spec
 */

describe('App#transactions', function() {

  // collect ids to cleanup
  var ids = [];
  var trans = [
    {
      description: 'skateboard',
      amount: 20,
      category: 'Shopping'
    },
    {
      description: 'iPad',
      amount: 400,
      category: 'Shopping'
    },
    {
      description: 'eggs',
      amount: 2,
      category: 'Groceries'
    }
  ];

  var tran = {
    description: 'test',
    amount: 14,
    category: 'testers'
  };

  // add some transactions
  beforeEach('add transactions', function() {
    trans.forEach(function(transaction) {
      r = transactions.add(transaction);
      ids.push(r.id);
    });
  });

  // remove any added transactions
  afterEach('cleanup', function() {
    ids.forEach(function(id) {
      transactions.remove(id);
    });
    ids = [];
  });

  /**
   * transactions.add()
   */

  describe('.add()', function() {
    // test return value
    it('should return the added transaction object', function() {
      // add to list
      r = transactions.add(tran);

      // should match init object
      expect(r.description).to.equal(tran.description);
      expect(r.amount).to.equal(tran.amount);
      expect(r.category).to.equal(tran.category);

      // add id to cleanup list
      ids.push(r.id);
    });

    // test state object
    it('should update the list of transactions', function() {
      // get last added transaction
      var last = transactions.get();
      r = trans[trans.length - 1];

      // should match last item in init array
      expect(last.description).to.equal(r.description);
      expect(last.amount).to.equal(r.amount);
      expect(last.category).to.equal(r.category);

      // check that .length() returns > 1
      var length = transactions.length();
      expect(length).to.be.above(0);
    });

    // test id incrementer
    it('should correctly autoincrement the id', function() {
      // get current last id
      var lastId = transactions.get().id;

      // add to list
      r = transactions.add(tran);
      ids.push(r.id);

      // get new last id
      var newLast = transactions.get().id;
      expect(lastId).to.equal(newLast - 1);
    });
  });

  /**
   * transactions.get()
   */

  describe('.get(id)', function() {
    // test lookup by id
    it('should return the correct transaction', function() {
      expect(transactions.get(1).description).to.equal('skateboard');
      expect(transactions.get(2).description).to.equal('iPad');
    });

    // test lookup most recent
    it('should return the most recent transaction', function() {
      var last = transactions.get();

      expect(last.description).to.equal('eggs');
    });
  });

  /**
   * transactions.edit()
   */

  describe('.edit(id, n)', function() {
    var id;
    var get;

    // Get a transaction to edit
    beforeEach('init', function() {
      id = transactions.add({
        description: 'toilet paper',
        amount: 3.89,
        category: 'Groceries'
      }).id;

      ids.push(id);
    });

    // test editing
    it('should be able to edit description', function(){
      transactions.edit(id, {
        description: 'paper towels'
      });

      get = transactions.get(id);
      expect(get.description).to.equal('paper towels');
      expect(get.amount).to.equal(3.89);
      expect(get.category).to.equal('Groceries');
    });

    it('should be able to edit amount', function() {
      transactions.edit(id, {
        amount: 2.47
      });

      get = transactions.get(id);
      expect(get.description).to.equal('toilet paper');
      expect(get.amount).to.equal(2.47);
      expect(get.category).to.equal('Groceries');
    });

    it('should be able to edit category', function() {
      transactions.edit(id, {
        category: 'Shopping'
      });

      get = transactions.get(id);
      expect(get.description).to.equal('toilet paper');
      expect(get.amount).to.equal(3.89);
      expect(get.category).to.equal('Shopping');
    });
  });

  /**
   * transactions.remove()
   */

  describe('.remove(id)', function() {
    var length = transactions.length();
    var id;
    var get;

    // init transaction
    before('init', function() {
      id = transactions.add({
        description: 'inhaler',
        amount: 34.89,
        category: 'Medical'
      }).id;

      ids.push(id);
    });

    // test delete function
    it('should delete the correct transaction', function() {
      r = transactions.remove(id);
      get = transactions.get(r.id);

      expect(get).to.not.exist;
      id = transactions.add(r).id;
      ids.push(id);
      expect(transactions.get(id).amount).to.equal(34.89);
    });

    // test error
    it('should return undefined if no transaction found', function() {
      r = transactions.remove(300);

      expect(r).to.not.exist;
    });
  });

  /**
   * transactions.total(category)
   */

  describe('.total()', function() {
    var allTotal, all;

    it('should return the total for all items', function() {
      allTotal = transactions.total();
      all = transactions.all().reduce(function(total, t) {
        total += t.amount;
        return total;
      }, 0);

      expect(allTotal).to.equal(all);
    });

    it('should return the total for a category', function() {
      allTotal = transactions.total('Shopping');
      all = transactions.all().reduce(function(total, t) {
        if (t.category === 'Shopping') return total + t.amount;
        return total;
      }, 0);

      expect(allTotal).to.equal(all);
      expect(allTotal).to.equal(420);
    });
  });

  /**
   * transactions.length()
   */

  describe('.length()', function() {
    var length;

    it('should be a number', function() {
      length = transactions.length();
      expect(length).to.be.a.number;
    });

    it('should be equal to transactions.all().length', function() {
      length = transactions.length();
      expect(length).to.equal(transactions.all().length);
    });
  });

});
