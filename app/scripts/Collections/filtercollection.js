var filtermodel = require('../Models/filtermodel.js');

var filterCollection = Backbone.Collection.extend({
    model: filtermodel,

    initialize: function() {

    },

    categoriessummaryData: function() {
        var arr = [];
        this.categoryarr = _.uniq(_.flatten(this.models.map(function(v, i) {
            return v.get('taskcatgories');
        })));

        this.categoryarr.map(function(val) {
            arr.push({
                name: val
            });
        })

        return arr;
    },

    tasktypesummaryData: function(key) {
        return _.map(this.summaryData(), function(mod) {
            // return mod[key];
            return {
                name: key,
                count: mod[key] ? mod[key] : 0,
                tasktypesbreakdown: mod.tasktypesbreakdown[key]
            }
        }, this);
    },

    findtypes: function() {
        var arr = [];
        this.each(function(model) {
            console.log(_.keys(model.get('tasktypes')));
            _.each(model.get('tasktypes'), function(mode) {
                arr.push(_.keys(mode));
            });
        });
        console.log(_.uniq(_.flatten(arr)));
    },

    revisedfiltering: function(arr) {
        var barr = [];

        this.each(function(month) {
            var obj = {},
                c = 0;
            obj.tasktypesbreakdown = {};

            _.each(month.get('tasktypes'), function(name) {
                arr.map(function(v) {
                    if (v in name) {
                        obj.tasktypesbreakdown[v] = name[v];
                        c += name[v];
                    }
                });
            });
            obj.monthname = month.get('monthname');
            obj.count = c;
            barr.push(obj);
        });

        return barr;
    },

    summaryData: function() {
        var arr = [],
            b = {};

        this.each(function(month) {
            var a = {};
            a.tasktypes = {}, a.count = 0;
            month.get('taskcatgories').forEach(function(v, i) {
                var temp = 0;
                for (key in month.get('tasktypes')[v]) {
                    a.tasktypes[key] = month.get('tasktypes')[v][key];
                    temp += month.get('tasktypes')[v][key];
                }
                a[v] = temp;
                a.count += a[v];
            });
            a.tasktypesbreakdown = month.get('tasktypes');
            a.monthname = month.get('monthname');
            arr.push(a);
        }, this)

        return arr;
    },

    alltasktypeData: function() {
        var arr = [],
            thiz = this;
        this.categoriessummaryData().forEach(function(obj) {
            arr.push(thiz.tasktypedetailData(obj.name));
        });

        return _.flatten(arr);
    },

    tasktypedetailData: function(key) {
        return _.map(_.uniq(_.flatten(_.map(this.models, function(model) {
            return _.keys(model.get('tasktypes')[key]);
        }))), function(m) {
            return {
                name: m,
                catname: key
            };
        });
    },

    tasktyperesultData: function(keyname, category) {
        var arr = [];
        this.each(function(model) {
            if (model.get('tasktypes')[category].hasOwnProperty(keyname)) {
                arr.push({
                    catname: category,
                    name: keyname,
                    count: model.get('tasktypes')[category][keyname]
                });
            } else {
                arr.push({
                    catname: category,
                    name: keyname,
                    count: 0
                });
            }
        }, this);

        return arr;
    }
});

module.exports = filterCollection;
