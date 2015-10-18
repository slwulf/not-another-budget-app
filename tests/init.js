/**
 * Modules
 */

// var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;

// Suppress quiet errors from app script
console.warn = function() {
  return undefined;
};
