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
    }

  }

});
