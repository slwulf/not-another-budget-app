const hbs = require('express-handlebars')
const numeral = require('numeral')

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
      return data.fn(this)
    },

    /**
     * {{#each items}}{{/each}}
     * Loop through an array in context
     */

    each: function(items, options) {
      return items.reduce(function(str, item) {
        return str += options.fn(item)
      }, '')
    },

    /**
     * {{money Number}}
     * Formats a number or integer as a
     * curency string.
     */

    money: function(number) {
      if (typeof number !== 'number') return number
      return numeral(number).format('$0,0.00')
    },

    /**
     * {{parseDate Date}}
     * Formats a date object as a simple
     * date string.
     */

    parseDate: function(date) {
      const month = date.getMonth() + 1
      const day = date.getDate()
      const year = date.getFullYear()
      return month + '/' + day + '/' + year
    },

    /**
     * {{#categories object}}{{/categories}}
     * Renders the categories view.
     */

    categories: function(object, options) {
      const categories = Object.keys(object).sort()

      return categories.reduce(function(str, category) {
        const months = object[category].map(function(m) {
          if (typeof m === 'string') {
            return { date: m, amount: 0 }
          }

          return m
        })

        return str += options.fn({ category, months })
      }, '')
    },

    /**
     * {{#compare lvalue operator rvalue}}{{/compare}}
     * Compares lvalue with rvalue given an operator
     */

    compare: function(lvalue, operator, rvalue, options) {
      var operators, result

      if (arguments.length < 3) {
        throw new Error('Handlebars Helper \'compare\' needs 2 parameters')
      }

      if (options === undefined) {
        options = rvalue
        rvalue = operator
        operator = '==='
      }

      operators = {
        '==': function(l, r) { return l == r },
        '===': function(l, r) { return l === r },
        '!=': function(l, r) { return l != r },
        '!==': function(l, r) { return l !== r },
        '<': function(l, r) { return l < r },
        '>': function(l, r) { return l > r },
        '<=': function(l, r) { return l <= r },
        '>=': function(l, r) { return l >= r },
        'typeof': function(l, r) { return typeof l == r }
      }

      if (!operators[operator]) {
        throw new Error('Handlebars Helper \'compare\' doesn\'t know the operator ' + operator)
      }

      result = operators[operator](lvalue, rvalue)

      if (result) {
        return options.fn(this)
      } else {
        return options.inverse(this)
      }
    }

  }

})
