/**
 * State Module Spec
 */

describe('App#state', function() {

/**
 * state.update(prop, obj)
 */

describe('state.update(prop, obj)', function() {
  it('should not allow to overwrite the update method', function() {
    var update = state.update('update', undefined);
    expect(update).to.equal(false);
  });
});

/**
 * state.length()
 */

/**
 * state.last()
 */

describe('state.last()', function() {
  var last;

  beforeEach('init', function() {
    last = state.last();
  });

  it('should return a transaction', function() {
    expect(last).to.contain.keys('id');
  });

  it('should have id greater than 0', function() {
    expect(last.id).to.be.above(0);
  });
});

/**
 * state.list();
 */

});
