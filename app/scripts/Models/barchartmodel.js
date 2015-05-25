var data = require('../data2.js');

var barchartmodel = Backbone.Model.extend({
    initialize: function() {
        this.months = "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(',');
        this.date = parseInt(new Date().getFullYear());
        this.check();
    },

    check: function(data) {
    	var data = data ? data.months : this.get('months');
        var a = _.pluck(data, 'monthname');
        var names = _.difference(this.months, a);
        _.each(names, function(name) {
                var obj = {
                    monthname: name.toString(),
                    remaining: 0,
                    taskcatgories: [],
                    tasktypes: {
                        tax: {},
                        finance: {}
                    }
                };

                data.splice(this.months.indexOf(name.toString()), 0, obj);
            }, this)
            // var obj = {
            // 	monthname: name.toString(),
            // 	remaining: 0,
            // 	taskcatgories: [],
            // 	tasktypes: {
            // 		tax:{},
            // 		finance:{}
            // 	}
            // };
            // console.log(this.months.indexOf(name.toString()));
            // this.get('months').splice(this.months.indexOf(name.toString()), 0, obj )
    },

    changedata: function(type) {
        if(typeof type === 'number'){
            this.date = type;
        } else {
            this.date = (type === 'next') ? this.date + 1 : this.date - 1;
        }
        var newdata = data(this.date);
        console.log(newdata);
        this.check(newdata);
        this.set(newdata);
        this.check();
    }
});

module.exports = new barchartmodel(data(new Date().getFullYear()));
