/**
 * State Module Spec
 */

/**
 * state.update(prop, obj)
 */

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
