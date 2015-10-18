/*
 * Budget
 * v 0.0.1
 *
 * This is a budget tracking app. It
 * can do the following things:
 *
 *   - Create, delete, edit, and list
 *     transaction data
 *   - Display various (customizable?)
 *     reports about transactions
 *   - Set and keep track of a budget
 *     with customizable categories
 *   - Sync data to a database (Node endpoint)
 *   - Load historical data from database (Node endpoint)
 *
 * It will use event-based architecture
 * for rendering data in the DOM to allow
 * live-updating lists and reports.
 */

// Modules
//
// Data/Model
// - What is a transaction?
// - Transaction CRUD
//
// Rendering/View
// - Template creation
// - DOM manipulation

(function() {
