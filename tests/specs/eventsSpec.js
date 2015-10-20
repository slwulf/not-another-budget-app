/**
 * Events Module Spec
 */

describe('App#events', function() {

  var testEvent = 0;
  var testHandler = function testHandler(data) {
    testEvent = data;
  };

  // test triggering
  it('should trigger an event', function() {
    events.on('testEvent', testHandler);

    events.trigger('testEvent', 'hello!');
    expect(testEvent).to.equal('hello!');

    events.trigger('testEvent', {
      test: 1,
      msg: 'hello world'
    });

    expect(testEvent.test).to.equal(1);
    expect(testEvent.msg).to.equal('hello world');
  });

  // test event removal
  it('should remove an event listener', function() {
    events.off('testEvent', testHandler);

    events.trigger('testEvent', 'goodbye');
    expect(testEvent).to.not.equal('goodbye');
  });

  // test data events
  describe('data events', function() {

    var dataTest;
    var r;
    var get;

    var dataHandler = function dataHandler(data) {
      dataTest = data;
    };

    before('init', function() {
      events.on('addTransaction', dataHandler);
      events.on('editTransaction', dataHandler);
      events.on('deleteTransaction', dataHandler);
    });

    // addTransaction triggered by transactions.add()
    it('should know when a transaction is added', function() {
      events.trigger('addTransaction', 3);
      expect(dataTest).to.equal(3);

      r = transactions.add({ description: 'test' });
      expect(dataTest.description).to.equal('test');
      expect(dataTest.id).to.equal(r.id);
    });

    // editTransaction triggered by transactions.edit()
    it('should know when a transaction is edited', function() {
      events.trigger('editTransaction', 'edited');
      expect(dataTest).to.equal('edited');

      get = transactions.get();
      r = transactions.edit(get.id, {
        description: 'tester',
        amount: 999
      });
      expect(r.id).to.equal(get.id);
      expect(r.amount).to.equal(999);
      expect(dataTest.amount).to.equal(999);
    });

    // deleteTransaction triggered by transactions.remove()
    it('should know when a transaction is deleted', function() {
      events.trigger('deleteTransaction', 'gone');
      expect(dataTest).to.equal('gone');

      get = transactions.get(1);
      r = transactions.remove(1);
      expect(transactions.get(r.id)).to.not.exist;
      expect(transactions.get(dataTest.id)).to.not.exist;
    });

  });

});
