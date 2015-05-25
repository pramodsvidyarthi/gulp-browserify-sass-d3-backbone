var barchart = require('./views/Barchartview.js');
var data = require('./Models/barchartmodel.js');

var router = Backbone.Router.extend({
	routes:{
		'':'showBarChart'
	},

	alertId: function (id) {
		alert(id);
	},

	showBarChart:function () {
		new barchart({
			el: '#showchart',
			model: data
		});
	}
});

module.exports = router;