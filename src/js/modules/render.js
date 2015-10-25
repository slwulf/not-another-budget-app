/**
 * Render Module
 */

var template = (function render(app) {

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

    // FIXME: This doesn't work for elements with
    // nested children.

    // Loop through nodes array-like
    while (len > 0) {
      node = nodes[keys[0]];

      // If node is undefined, exit
      if (!node) break;

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
      len -= 1;

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

    // Render amounts with 2 decimals
    if (key === 'amount') {
      return model[key].toFixed(2);
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
   * Clones a template's node and attaches the
   * clone to the template's original parent
   * @param {Object} template A template instance
   * @param {Object} model Another model's instance
   * @param {Boolen} append When true, appends the element
   */

  var renderTemplate = function renderTemplate(template, model, append) {
    var node = template.node.cloneNode(true);
    var render = parseNode(node, model);
    var firstChild = template.parent.firstElementChild;
    var nextChild = firstChild.nextElementSibling;

    if (append === undefined) append = true;

    if (append) {
      if (firstChild && firstChild.className === node.className) {
        template.parent.insertBefore(node, firstChild);
      } else if (nextChild && nextChild.className === node.className) {
        template.parent.insertBefore(node, nextChild);
      } else {
        template.parent.appendChild(node);
      }
    }

    return node;
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

  /**
   * Public Methods
   */

  return {
    render: renderTemplate,
    get: function getTemplate(name) {
      return templates[name];
    }
  };

})(state);
