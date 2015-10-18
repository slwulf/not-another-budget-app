/**
 * Render Module
 */

/*
  HTML rendering should be done primarily on the server.
  JS should copy DOM elements rendered by the server
  to be used as templates. Templates should be defined
  in the HTML

  Mark each template with a class `template` and a
  unique `id`. These will be copied and removed from
  the DOM at runtime. In CSS, the `template` class
  should be set to `display: none`.

  DOM templates should be exactly what you want the
  script to reproduce. The `template` class will be
  removed. The `id` will be converted into a class
  name which can be styled against and which will
  be used to select instances of the template in JS.

  Here is a loose spec for a template element in HTML:
  <nodeName id="my-template-object" class="template" />

  A template can be any element with any attributes.
  It can include classes other than `template`. The template
  will include any children of the element.

  This render module is intended to create multiple copies
  of a common interface component. As such, rendered templates
  cannot have IDs of their own by nature. This module is
  not intended for rendering one-off components.

???
  One-off components, such as navigation or HUD-likes,
  should be initially rendered by the DOM. Sometimes,
  these components will require some information about
  application state.

  In a separate module, Interactions, we'll house DOM
  events like `click` and `keyup`. Another module may
  expose DOM event handlers, if necessary.
???
 */