var dropdown = require('../components/dropdown.js');
var dropdowncol = require('../collections/dropdowncollection.js');
var templates = require('../templates/templates.js')

var filterView = Backbone.View.extend({
    tagName: 'div',
    className:'showfilters',
    template: templates.filterviewtemplate,

    initialize: function(options) {
        this.categoryname = "";
        this.catgeorycollection = new dropdowncol(this.collection.categoriessummaryData());
        this.tasktypecollection = new dropdowncol(this.collection.alltasktypeData());

        Backbone.Events.on('pass:item', this.filterData, this);

        this.render();
    },

    events: {
        'click .year': 'fetchData'
    },

    fetchData: function(e) {
        Backbone.Events.trigger('fetch:data', e.currentTarget.id);
    },

    closeandRemove: function() {
        // Backbone.Events.trigger('clean:dropdowns');
        this.taskcategoryview.closeandremove();
        this.tasktypesview.closeandremove();
        this.undelegateEvents();
        this.remove();
    },

    filterData: function(key, name, catname) {
        // this.collection.findtypes();
        var thiz = this;
        switch (name) {
            case 'taskcategory':
                return (function() {
                    thiz.categoryname = key;
                    if (key !== 'reset') {
                        Backbone.Events.trigger('showfiltereddata', thiz.collection.tasktypesummaryData(thiz.categoryname), key);
                        thiz.tasktypecollection.filteronCategory(key);
                        Backbone.Events.trigger('change:text');
                    } else {
                        Backbone.Events.trigger('showfiltereddata', null, key);
                        thiz.tasktypecollection.resetallModels();
                        Backbone.Events.trigger('change:text');
                    }
                })();
                break;

            case 'tasktypes':
                return (function() {
                    if (key !== 'reset') {
                        Backbone.Events.trigger('showfiltereddata', thiz.collection.tasktyperesultData(key, catname), key);
                    } else {
                        if (thiz.categoryname !== "" && thiz.categoryname !== 'reset') {
                            console.log(thiz.categoryname);
                            Backbone.Events.trigger('showfiltereddata', thiz.collection.tasktypesummaryData(thiz.categoryname), key);
                        } else {
                            Backbone.Events.trigger('showfiltereddata', null, key);
                        }
                    }
                })();
        }

    },

    createdropDowns: function(element, collection, viewname) {
        this[viewname + "view"] = new dropdown({
            el: this.$el.find(element),
            collection: collection,
            viewname: viewname
        });
    },

    render: function() {
        this.$el.append(this.template({
            yr: this.options.year
        }));

        this.createdropDowns('.filtercategory', this.catgeorycollection, "taskcategory");
        this.createdropDowns('.filtertypes', this.tasktypecollection, "tasktypes");

        return this;

        // new dropdown({
        //     el: $('.filteryr'),
        //     viewname: "year",
        //     collection: new dropdowncol([{
        //         name: 2014
        //     }, {
        //         name: 2013
        //     }, {
        //         name: 2012
        //     }, {
        //         name: 2011
        //     }])
        // });

    }
});

module.exports = filterView;
