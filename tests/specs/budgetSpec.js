/**
 * Budget Module Spec
 */

describe('App#budget', function() {

  /**
   * budget.add()
   */

  describe('.add()', function() {
    it('should return the added budget object', function() {
      var b = budget.add({
        category: 'test',
        amount: 420
      });

      expect(b.category).to.equal('test');
      expect(b.amount).to.equal(420);
    });

    it('should not allow the same category twice', function() {
      var b = budget.add({
        category: 'test',
        amount: 69
      });

      expect(b.category).to.equal('test');
      expect(b.amount).to.equal(420);
    });
  });

  /**
   * budget.get()
   */

  describe('.get(name)', function() {
    it('should return the requested budget category', function() {
      var b = budget.get('test');
      expect(b.amount).to.equal(420);
    });

    it('should return the most recently added category', function() {
      var b = budget.add({
        category: 'Groceries',
        amount: 300
      });

      var get = budget.get();

      expect(get.category).to.equal('Groceries');
      expect(get.amount).to.equal(300);
    });
  });

  /**
   * budget.edit()
   */

  describe('.edit(name, n)', function() {
    it('should be able to edit category', function() {
      var b = budget.get('Groceries');
      var edited = budget.edit('Groceries', {
        category: 'Shopping'
      });

      expect(edited.category).to.equal('Shopping');
      expect(edited.amount).to.equal(b.amount);
    });

    it('should be able to edit amount', function() {
      var b = budget.get('Shopping');
      var edited = budget.edit('Shopping', {
        amount: 420
      });

      expect(edited.amount).to.equal(420);
      expect(edited.category).to.equal(b.category);
    });
  });

  /**
   * budget.remove()
   */

  describe('.remove(name)', function() {
    it('should delete the correct budget', function() {
      var b = budget.get('Shopping');
      var del = budget.remove('Shopping');

      expect(del.category).to.equal('Shopping');
      expect(del.amount).to.equal(b.amount);
    });

    it('should return undefined if no category found', function() {
      var b = budget.get('Shopping');
      expect(b).to.not.exist;
    });
  });

  /**
   * .isOverBudget()
   */

  describe('.isOverBudget(name)', function() {
    var t;

    before('init', function() {
      t = transactions.add({
        description: 'test',
        category: 'Shopping',
        amount: 300
      }).id;

      budget.add({
        category: 'Shopping',
        amount: 200
      });
    });

    it('should know if the user has spent more than budgeted', function() {
      var over = budget.isOverBudget('Shopping');

      expect(over).to.be.true;
    });

    after('exit', function() {
      transactions.remove(t);
      budget.remove('Shopping');
    });
  });

});
