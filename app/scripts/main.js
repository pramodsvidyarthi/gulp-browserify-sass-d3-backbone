window.$ = require('jquery-browserify');
window._ = require('underscore');
window.Backbone = require('backbone-browserify');
window.d3 = require('d3-browserify');
window.data = require('./data2.js');
// Backbone.setDomLibrary($);

var a = require('./router.js');


var b = new a();

Backbone.history.start();