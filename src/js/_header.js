/*
 * Not Another Budget App
 * v 0.0.2
 *
 * What the hell am I doing...?
 *
 *   = MODULES =
 *
 *   - Transactions -
 *   Keeps track of and categorizes expenses
 *   RAGE API (remove, add, get, edit) (rage > crud)
 *     (to be refactored -> events w/ no API)
 *
 *   - Events -
 *   Global (to the app) events API
 *     .on(event, fn) Set event listener
 *     .off(event, fn) Remove event listener
 *     .trigger(event, data) Deliver data to listeners
 *
 *   - Render -
 *   DOM API... more details in render.js
 *
 * Transactions is the base data module.
 * Other data types will be built similarly:
 *   First, declare a model factory and a data set.
 *   Second, create stateless private functions to
 *     operate on the data. Data in, data out.
 *   Finally, expose an API and attach events.
 *   Write tests in conjunction.
 */

// Modules
//
// Events (done! except putting events everywhere)
//
// Data/Model
// - Transactions (done! except not really)
// - Budgets: tracks budget by category
//            sets category amts to set or %
// - Reports: calculates various stats based on
//              other modules
//
// Rendering/View
// - Template creation
// - DOM manipulation
//
// Routes
// - oh god am i really gonna do routes
// - yeah i guess i have to
//
// OMG SERVER LAYER!
// - store 5 or 10 or x most recently added records
//   in localStorage and sync to server when limit
//   is reached
// - if limit is reached and server times out, allow
//   limit to be exceeded for next limit / 2 records,
//   then retry sync
// - ta-da! offline-friendly app

(function App(window, document) {
