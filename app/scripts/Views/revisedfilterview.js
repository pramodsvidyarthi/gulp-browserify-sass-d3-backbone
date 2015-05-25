var template = require('../templates/templates.js');

var filtersView = Backbone.View.extend({
    template: template.revisedfilterviewtemplate,
    initialize: function() {
        this.filters = _.pluck(this.collection.alltasktypeData(), 'name');
        Backbone.Events.on('uncheck:icon', this.uncheck, this);
        Backbone.Events.on('filter:tasktypes', this.filterData, this);
        this.render();
    },

    filterData: function(key, action) {
        if (action === 'add') {
            this.filters.push(key);
            var data = this.collection.revisedfiltering(this.filters);
            Backbone.Events.trigger('showfiltereddata', data);
        } else {
            this.filters = _.without(this.filters, key);
            var data = this.collection.revisedfiltering(this.filters);
            Backbone.Events.trigger('showfiltereddata', data);
        }
    },

    uncheck: function(num) {
        Backbone.Events.trigger('fetch:data', num);
        // return this.$el.find('i.fa-dot-circle-o').removeClass('fa-dot-circle-o').addClass('fa-circle-o');
    },

    events: {
        'click .toggleyear': 'toggledetailedView',
        'click .move': 'fetchData'
    },

    closeandRemove: function (){
        this.yearviews.forEach(function (view){
            view.remove();
        });
        this.tasktypeview.forEach(function (view){
            view.remove();
        });
        this.remove();
    },

    fetchData: function(e) {
        var ele = e.currentTarget.id;
        console.log(ele);
         Backbone.Events.trigger('fetch:data', ele);
        //     num = this.$el.find('i.fa-dot-circle-o').parent().index();
      
        // if(ele.hasClass('next')){
        //     if(num < 10){
        //         this.uncheck().parent().next('.duedateyear').children('i.fa-circle-o').removeClass('fa-circle-o').addClass('fa-dot-circle-o');
        //     } else {
        //         return false;
        //     }
        // } else {
        //     if(num < 1){
        //         return false
        //     } else {
        //         this.uncheck().parent().prev('.duedateyear').children('i.fa-circle-o').removeClass('fa-circle-o').addClass('fa-dot-circle-o');     
        //     }
        // }
    },

    toggledetailedView: function(e) {
        var ele = $(e.currentTarget);
        this.$el.find('.detailedfilters').slideToggle(200, function() {
            if (ele.hasClass('fa-angle-down')) {
                ele.removeClass('fa-angle-down').addClass('fa-angle-up');
            } else {
                ele.removeClass('fa-angle-up').addClass('fa-angle-down');
            }
        });
    },

    yearList: function(yr) {
        this.yearviews = [];
        for (var i = yr - 5, j=0; i <= yr + 5; i++,j++) {
           this.yearviews.push(new yearView({
                data: {
                    name: i,
                    year: yr
                }
            }));
            this.$el.find('.yearlist').append(this.yearviews[j].el);
        };
    },

    tasktypeList: function() {
        this.tasktypeview = [];
        _.each(this.collection.alltasktypeData(), function(model, index) {
            this.tasktypeview.push(new tastypeview({
                model: model
            }));
            this.$el.find('.tasktypelist').append(this.tasktypeview[index].el);
        }, this);
    },

    render: function() {
        this.$el.append(this.template({ year: this.options.year }));
        this.yearList(this.options.year);
        this.tasktypeList();
        return this;
    }
});

var yearView = Backbone.View.extend({
    tagName: 'div',
    className: 'duedateyear',
    template: _.template('<i class="fa fa-circle-o"></i><%= name %>'),
    events: {
        'click': 'toggleradio'
    },

    toggleradio: function(e) {
        var radio = this.$el.find('i');
        Backbone.Events.trigger('uncheck:icon', this.options.data.name);
        if (radio.hasClass('fa-circle-o')) {
            radio.removeClass('fa-circle-o').addClass('fa-dot-circle-o')
        } else {
            radio.removeClass('fa-dot-circle-o').addClass('fa-circle-o')
        }
    },

    initialize: function() {
        this.render();
    },

    render: function() {
        if (this.options.data.name === this.options.data.year) {
            this.$el.append(_.template('<i class="fa fa-dot-circle-o"></i><%= name %>')(this.options.data));
        } else {
            this.$el.append(this.template(this.options.data));
        }
        return this;
    }
});

var tastypeview = Backbone.View.extend({
    tagName: 'div',
    className: 'tasktypes',
    template: _.template('<i class="fa fa-check-square-o"></i><%= name %>'),
    initialize: function() {
        this.render();
    },

    events: {
        'click': 'togglecheckbox'
    },

    togglecheckbox: function() {
        var checkbox = this.$el.find('i');
        if (checkbox.hasClass('fa-check-square-o')) {
            checkbox.removeClass('fa-check-square-o').addClass('fa-square-o');
            Backbone.Events.trigger('filter:tasktypes', this.model.name, 'remove');
        } else {
            checkbox.removeClass('fa-square-o').addClass('fa-check-square-o');
            Backbone.Events.trigger('filter:tasktypes', this.model.name, 'add');
        }
    },

    render: function() {
        this.$el.append(this.template(this.model));
        return this;
    }
});

module.exports = filtersView;
