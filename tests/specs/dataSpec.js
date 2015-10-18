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
  it('should update the list of transactions', function() {
    // add to list
    var r = data.add(tran);

    // get state list
    var last = data.get();

    expect(last.description).to.equal(tran.description);
    expect(last.amount).to.equal(tran.amount);
    expect(last.category).to.equal(tran.category)
  });

  // test id incrementer
  it('should correctly autoincrement the id', function() {
    // get current last id
    var lastId = data.get().id;

    // add to list
    var r = data.add(tran);

    // get new last id
    var newLast = data.get().id;

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
    var bagel = data.all().filter(function(tran) {
      return tran.description === 'bagels';
    })[0];

    var creamCheese = data.all().filter(function(tran) {
      return tran.description === 'cream cheese';
    })[0];

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

describe('data.edit(id, n)', function() {
  var id;
  var get;

  // Get a transaction to edit
  before('init', function() {
    id = data.add({
      description: 'toilet paper',
      amount: 3.89,
      category: 'Groceries'
    }).id;
  });

  // test editing
  it('should be able to edit description', function(){
    data.edit(id, {
      description: 'paper towels'
    });

    get = data.get(id);
    expect(get.description).to.equal('paper towels');
    expect(get.amount).to.equal(3.89);
    expect(get.category).to.equal('Groceries');
  });

  it('should be able to edit amount', function() {
    data.edit(id, {
      amount: 2.47
    });

    get = data.get(id);
    expect(get.description).to.equal('paper towels');
    expect(get.amount).to.equal(2.47);
    expect(get.category).to.equal('Groceries');
  });

  it('should be able to edit category', function() {
    data.edit(id, {
      category: 'Shopping'
    });

    get = data.get(id);
    expect(get.description).to.equal('paper towels');
    expect(get.amount).to.equal(2.47);
    expect(get.category).to.equal('Shopping');
  });
});

/**
 * data.remove()
 */

describe('data.remove(id)', function() {
  var length = data.length();
  var id;
  var get;
  var r;

  // init transaction
  before('init', function() {
    id = data.add({
      description: 'inhaler',
      amount: 34.89,
      category: 'Medical'
    }).id;
  });

  // test delete function
  it('should delete the correct transaction', function() {
    r = data.remove(id);
    get = data.get(r.id);

    expect(get).to.not.exist;
    id = data.add(r).id;
    expect(data.get(id).amount).to.equal(34.89);
  });

  // test error
  it('should return undefined if no transaction found', function() {
    r = data.remove(300);

    expect(r).to.not.exist;
  });
});

/**
 * data.all()
 */

describe('data.all()', function() {
  var all = data.all();

  it('should return an array', function() {
    expect(all).to.be.an.array;
  });

  it('should have length data.length()', function() {
    expect(all.length).to.equal(data.length());
  });
});

/**
 * data.length()
 */

describe('data.length()', function() {
  var length;

  before('init', function() {
    length = data.length();
  });

  it('should be a number', function() {
    expect(length).to.be.a.number;
  });

  it('should be equal to data.all().length', function() {
    expect(length).to.equal(data.all().length);
  });
});

});
