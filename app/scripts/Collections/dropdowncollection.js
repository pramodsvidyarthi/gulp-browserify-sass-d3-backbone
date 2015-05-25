var ddcollection = Backbone.Collection.extend({
	initialize: function () {
		
	},

	resetallModels: function (){
		this.originalModels = this.originalModels ? this.originalModels : this.toJSON();
		this.reset(this.originalModels);
	},

	filteronCategory: function (keyname){
		this.originalModels = this.originalModels ? this.originalModels : this.toJSON();
		var arr = _.where(this.originalModels, { catname: keyname });
		arr.push({name:'reset'});
		this.reset(arr);
	}
});

module.exports = ddcollection;