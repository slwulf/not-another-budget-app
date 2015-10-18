/**
 * Data Module Spec
 */

describe('App#data', function() {

/**
 * data.add()
 */

describe('data.add()', function() {
  var tran;

  // init a dummy transaction
  before('init', function() {
    tran = {
      description: 'skateboard',
      amount: 87.48,
      category: 'Shopping'
    };
  });

  // test return value
  it('should return the added transaction object', function() {
    // add to list
    var r = data.add(tran);

    expect(r.description).to.equal(tran.description);
    expect(r.amount).to.equal(tran.amount);
    expect(r.category).to.equal(tran.category);
  });

  // test state object
  it('should update the global state object', function() {
    // add to list
    var r = data.add(tran);

    // get state list
    var last = state.last();

    expect(last.description).to.equal(tran.description);
    expect(last.amount).to.equal(tran.amount);
    expect(last.category).to.equal(tran.category)
  });

  // test id incrementer
  it('should correctly autoincrement the id', function() {
    // get current last id
    var lastId = state.last().id;

    // add to list
    var r = data.add(tran);

    // get new last id
    var newLast = state.last().id;

    expect(lastId).to.equal(newLast - 1);
  });
});

/**
 * data.get()
 */

describe('data.get(id)', function() {
  // add some transactions
  before('init', function() {
    data.add({ description: 'bagels', amount: 1.99, category: 'Groceries' });
    data.add({ description: 'cream cheese', amount: 0.85, category: 'Groceries' });
    data.add({ description: 'orange juice', amount: 2.39, category: 'Groceries' });
  });

  // test lookup by id
  it('should return the correct transaction', function() {
    var bagel = state.list().filter(function(tran) {
      return tran.description === 'bagels';
    })[0];

    var creamCheese = state.list().filter(function(tran) {
      return tran.description === 'cream cheese';
    })[0];

    // console.log('bagel.id:', bagel.id);
    // console.log('creamCheese.id:', creamCheese.id);
    // console.log('data.get(bagelId):',data.get(bagelId));

    expect(data.get(bagel.id).description).to.equal('bagels');
    expect(data.get(creamCheese.id).description).to.equal('cream cheese');
  });

  // test lookup most recent
  it('should return the most recent transaction', function() {
    var last = data.get();

    expect(last.description).to.equal('orange juice');
  });
});

/**
 * data.edit()
 */

/**
 * data.remove()
 */

});
