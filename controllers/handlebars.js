var hbs = require('express-handlebars');

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
    }

  }

});
