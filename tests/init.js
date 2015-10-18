/**
 *  Node Modules
 */

var chai = require('chai');
var expect = chai.expect;

/**
 * Overrides
 */

// Suppress quiet errors from app script
console.warn = function() {
  return undefined;
};
