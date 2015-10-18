/**
 * State Module Spec
 */

describe('App#state', function() {

  describe('.isTest', function() {
    it('should be true', function() {
      expect(state.isTest).to.be.true;
    });

    it('should be editable', function() {
      state.isTest = false;
      expect(state.isTest).to.be.false;
      state.isTest = true;
    });
  });

});
