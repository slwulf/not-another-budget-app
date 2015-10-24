/**
 * Render Module
 */

var render = (function(app) {

  /**
   * Templates list
   */

  var templates = {};

  /**
   * Template model
   * @param {Element} node HTML Element
   * @param {Object} model Data model used by template
   * @param {Element} parent The parent node of the template
   */

  var Template = function Template(obj) {
    return {
      node: obj.node || document.createDocumentFragment(),
      model: obj.model || false,
      parent: obj.parent || document.body
    };
  };

  /**
   * Takes Elements with class name
   * @return {Array} An array of Template objects
   */

  var getTemplates = function getTemplates() {
    var nodes = document.getElementsByClassName('template');
    var keys = Object.keys(nodes);
    var len = keys.length;
    var newTemplate;
    var model;
    var clone;
    var node;
    var id;
    var i;

    // Loop through nodes array-like
    for (i = 0; i < len / 2; i++) {
      node = nodes[keys[i]];
      id = node.id;

      // Skip if template already exists
      if (templates.hasOwnProperty(id)) {
        node.remove();
        continue;
      }

      // Get template components
      clone = node.cloneNode(true);
      model = node.dataset ? node.dataset.model : false;
      parent = node.parentNode;

      // Setup clone classes
      clone.classList.remove('template');
      clone.classList.add(id);
      clone.removeAttribute('id');

      // Create a Template instance
      newTemplate = Template({
        node: clone,
        model: model,
        parent: parent
      });

      // Remove template from the DOM
      node.remove();

      // Add to list
      templates[id] = newTemplate;
    }
  };

  /**
   * Template string regex
   * Matches for any string like:
   *     _(arbitrary.text)
   */

  var isTemplateString = function isTemplateString(str) {
    var templateString = /_\(([a-z]*).([a-z]*)\)/gi;
    return templateString.test(str);
  };

  /**
   * Takes a template string like _(model.property)
   * and a model instance and returns the value
   * @param {String} tStr A template string
   * @param {Object} model An instance of a model to render
   * @return {String} The requested value
   */

  var parseTemplateString = function parseTemplateString(tStr, model) {
    // First, remove any _, (, and )
    var clean = tStr.replace(/[_\(\)]/g, '');

    // Next, split the string at .
    var parts = clean.split('.');

    // If nothing was split, return
    if (parts.length === 1) return parts[0];

    // Otherwise, get the key
    var key = parts[1];
    var data = model[key];

    // Assume dates are stored in ms & convert them
    var date;
    if (key === 'date') {
      date = new Date(data);
      return (date.getMonth() + 1) + '/' + date.getDate();
    }

    // Otherwise, return the requested value
    return model[key];
  };

  /**
   * Takes a DOM node and loops through
   * dataset and textContent for template strings
   * @param {Element} node The DOM node
   * @param {Object} model An instance of a model to render
   * @return {Element} The same DOM node, parsed
   */

  var parseNode = function parseNode(node, model) {
    var dataset = node.dataset;
    var children = node.children;

    var keys = Object.keys(dataset);
    var len = keys.length;
    var parsed;
    var child;
    var text;
    var data;
    var key;
    var i;

    // Parse any data attributes
    for (i = 0; i <= len; i++) {
      key = keys[i];
      data = dataset[key];

      if (isTemplateString(data)) {
        parsed = parseTemplateString(data, model);
        node.dataset[key] = parsed;
      }
    }

    // Parse any children
    for (i = 0, len = children.length; i < len; i++) {
      child = children[i];
      text = child.textContent;

      node.children[i].textContent = parseTemplateString(text, model);
    }

    // Return the altered node
    return node.cloneNode(true);
  };

  /**
   * Returns a cloned template from the list.
   * @param {String} name Name of the template to get
   * @return {Element} A cloned node
   */

  var getTemplate = function getTemplate(name) {
    return templates[name].node.cloneNode(true);
  };

  /**
   * Initialize
   */

  // Return test methods
  if (app.isTest) {
    return {
      isTemplateString: isTemplateString,
      parseTemplateString: parseTemplateString,
      all: function all() {
        return templates;
      }
    };
  }

  getTemplates();

  // This section is just for testing at the moment.
  // Will break out DOM and app event handlers into
  // a separate module.

  events.on('addTransaction', function(tran) {
    var newTran = parseNode(getTemplate('transaction'), tran);
    document.getElementById('main').appendChild(newTran);
  });

  transactions.add({
    description: 'test',
    amount: 4.35,
    category: 'Test'
  });

  transactions.add({
    description: 'another test',
    amount: 4.20,
    category: 'Test'
  });

  /**
   * Public Methods
   */

  return {
    get: getTemplate,
    parse: parseNode
  };

})(state);
