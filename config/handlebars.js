var hbs = require('express-handlebars');
var numeral = require('numeral');

module.exports = hbs.create({

  /**
   * App Settings
   */

  extname: '.hbs',
  layoutsDir: './views/layouts',
  partialsDir: './views/partials',
  defaultLayout: 'main',

  /**
   * Template Helpers
   */

  helpers: {

    /**
     * {{{{raw}}}} {{{{/raw}}}}
     * Allows hbs syntax to be rendered raw. For
     * use with AngularJS.
     */

    raw: function(data) {
      return data.fn(this);
    },

    /**
     * {{#each}}{{/each}}
     * Loop through an array in context
     */

    each: function(context, options) {
      var ret = "";

      for (var i=0, j=context.length; i<j; i++) {
        ret = ret + options.fn(context[i]);
      }

      return ret;
    },

    /**
     * {{money Number}}
     * Formats a number or integer as a
     * curency string.
     */

    money: function(number) {
      if (typeof number !== 'number') return number;
      return numeral(number).format('$0,0.00');
    },

    /**
     * {{parseDate Date}}
     * Formats a date object as a simple
     * date string.
     */

    parseDate: function(date) {
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var year = date.getFullYear();
      return month + '/' + day + '/' + year;
    },

    /**
     * {{#compare lvalue operator rvalue}}{{/compare}}
     * Compares lvalue with rvalue given an operator
     */

    compare: function(lvalue, operator, rvalue, options) {
      var operators, result;

      if (arguments.length < 3) {
        throw new Error('Handelbars Helper \'compare\' needs 2 parameters');
      }

      if (options === undefined) {
        options = rvalue;
        rvalue = operator;
        operator = '===';
      }

      operators = {
        '==': function(l, r) { return l == r; },
        '===': function(l, r) { return l === r; },
        '!=': function(l, r) { return l != r; },
        '!==': function(l, r) { return l !== r; },
        '<': function(l, r) { return l < r; },
        '>': function(l, r) { return l > r; },
        '<=': function(l, r) { return l <= r; },
        '>=': function(l, r) { return l >= r; },
        'typeof': function(l, r) { return typeof l == r; }
      };

      if (!operators[operator]) {
        throw new Error('Handelbars Helper \'compare\' doesn\'t know the operator ' + operator);
      }

      result = operators[operator](lvalue, rvalue);

      if (result) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    }

  }

});
