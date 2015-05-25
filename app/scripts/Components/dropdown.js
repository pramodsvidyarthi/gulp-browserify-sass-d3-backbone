var templates = require('../templates/templates.js')

var dropdownlistView = Backbone.View.extend({
    template: templates.dropdowntemplate,

    events: {
        'click .js-link': 'showdropDown',
    },

    showdropDown: function(e) {
        e.preventDefault();
        this.$el.find('.js-dropdown-list').slideToggle(200).css('overflow', 'auto');
    },

    initialize: function(options) {
        this.subViews = [];
        this.viewname = options.viewname;
        this.collection.add({
            name: 'reset'
        });
        this.$el.append(this.template({ viewname: this.viewname }));
        this.render();

        this.collection.on('reset', this.rerender, this);
        Backbone.Events.on(this.cid + 'item:selected', this.toggleList, this);
        Backbone.Events.on('change:text', this.toggleVisibility, this);
        // Backbone.Events.on('clean:dropdowns', this.closeandremove, this);

    },

    closeandremove: function (){
        // console.log('clean cald');
        this.close();
        this.undelegateEvents();
        this.remove();
    },

    rerender: function() {
        // this.collection.add({
        //     name: 'reset'
        // });
        this.close();
        this.render();
    },

    close: function() {
        this.subViews.forEach(function(view) {
            view.closeandremove();
        });
        this.subViews = [];
    },

    toggleVisibility: function() {
        var link = this.$el.find('.js-link'),
            icon = '<i class="fa fa-chevron-down"></i>';

        link.html('All '+this.viewname + ' ' + icon);
    },

    toggleList: function(text, catname) {
        var text = text,
            link = this.$el.find('.js-link'),
            icon = '<i class="fa fa-chevron-down"></i>';

        Backbone.Events.trigger('pass:item', text, this.viewname, catname);
        this.$el.find('.js-dropdown-list').slideToggle(200);

        if (text === 'reset') {
            link.html('All '+ this.viewname + ' ' + icon);
        } else {
            link.html(text + icon);
        }
    },

    render: function() {
        this.collection.each(function(model, index) {
            this.subViews.push(new dropdownitemView({
                model: model,
                viewname: this.cid
            }));
            this.$el.find('.js-dropdown-list').append(this.subViews[index].el);
        }, this)
    },
});


var dropdownitemView = Backbone.View.extend({
    tagName: 'li',
    events: {
        'click': 'itemSelected'
    },

    itemSelected: function(e) {
        Backbone.Events.trigger(this.parentviewname + 'item:selected', this.model.get('name'),this.model.get('catname'));
    },

    template: _.template("<%= name %>"),

    initialize: function(options) {
        this.parentviewname = options.viewname;
        this.render();
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    closeandremove: function () {
        this.undelegateEvents();
        // $(this.el).undelegate(this.el, 'click');
        this.remove();
    }
});

module.exports = dropdownlistView;
