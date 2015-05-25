var filters = require('./filtersview.js');
var filterview = require('./revisedfilterview.js');
var filtercol = require('../Collections/filtercollection.js');
var tip = require('../components/tooltip.js');

var barchart = Backbone.View.extend({
    initialize: function() {
        this.filtercollection = new filtercol(this.model.get('months'));;

        this.render();
        Backbone.Events.on('showfiltereddata', this.doTransition, this);
        Backbone.Events.on('fetch:data', this.fetchnewData, this);

        this.model.on('change', this.notify, this);
    },

    fetchnewData: function(id) {
        this.model.changedata(id);
    },

    notify: function(e) {
        this.filtersView.closeandRemove();
        this.filtercollection = new filtercol(this.model.get('months'));
        this.doTransition(null);

        this.filtersView = new filterview({
            year: this.model.get('year'),
            collection: this.filtercollection,
        });
        $('#filters').append(this.filtersView.el);
        // this.createfiltersView();
    },

    doTransition: function(arr, key) {
        var data = arr === null ? this.filtercollection.summaryData() : arr;

        // console.log(data, this.model.toJSON());
        this.svg.selectAll('rect')
            .data(data)
            .transition()
            .duration(400)
            .attr('width', function(d) {
                // return d.count < 50 ? (d.count * 6) : d.count
                return d.count > 0 ? (d.count + 100) : d.count;
            });

        this.textTransition(data);
    },

    textTransition: function(data) {
        this.svg.selectAll('.count')
            .data(data)
            .transition()
            .duration(400)
            .text(function(d) {
                return d['count'];
            });
    },

    events: {

    },

    initialSetup: function() {
        var margin = this.defaults.margin;

        this.width = 960 - margin.left - margin.right;
        this.height = 600 - margin.top - margin.bottom;
    },

    appendSvg: function() {
        var margin = this.defaults.margin;

        this.svg = d3.select(this.el).append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .append("g")
            .attr("transform", "translate(" + (960 * 10 / 100) + "," + margin.top + ")");
    },

    render: function() {
        this.initialSetup();
        this.appendSvg();
        this.renderAxis();
        this.renderData();
        this.renderText();
        this.filtersView =  new filterview({
            year: this.model.get('year'),
            collection: this.filtercollection,
        });
        $('#filters').append(this.filtersView.el);
        // this.createfiltersView();

        return this;

    },

    createfiltersView: function() {
        this.filtersView = new filters({
            collection: this.filtercollection,
            year: this.model.get('year')
        });
        $('#chartsummary').append(this.filtersView.el);
    },

    defaults: {
        margin: {
            top: 20,
            right: 0,
            bottom: 20,
            left: 0
        },
    },

    getXScale: function() {
        return d3.scale.ordinal()
            .domain([0, 1])
            .rangePoints([0, this.width], 1);
    },

    getYScale: function() {
        return d3.scale.ordinal()
            .rangeRoundBands([0, this.height], .6)
            .domain(_.pluck(this.filtercollection.toJSON(), 'monthname'));

        // return d3.time.scale()
        //     .domain([new Date(2012, 0, 1), new Date(2012, 11, 31)])
        //     .range([0, this.height]);
    },

    renderAxis: function() {
        //only yaxis, xaxis not required

        var yAxis = d3.svg.axis()
            .scale(this.getYScale())
            .orient("left")
            .tickSize(5);

        // var yAxis = d3.svg.axis()
        //     .scale(this.getYScale())
        //     .orient("left")
        //     .ticks(d3.time.months)
        //     // .tickSize(16, 0)
        //     .tickFormat(d3.time.format("%b"));

        this.svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
    },

    renderData: function() {
        var self = this;
        this.svg.append('g')
            .attr('class', 'rects')
            .selectAll("rect")
            .data(this.filtercollection.summaryData())
            .enter()
            .append("rect")
            .on('click', self.showSearchResults)
            .style('fill', '#269')
            .attr("x", self.getXScale(0))
            .attr("y", function(d, i) { 
                return self.getYScale()(d.monthname);
            })
            .attr("width", 0)
            .transition()
            .duration(1000)
            .attr("width", function(d, i) {
                return d.count > 0 ? (d.count + 100) : d.count;
            })
            .attr("height", 25)
            .call(tip);
    },

    renderText: function() {
        var self = this;
        this.svg.append('g')
            .selectAll('text')
            .data(this.model.get('months'))
            .enter()
            .append('text')
            .attr('class', 'count')
            .text(function(d) {
                return d.remaining;
            })
            .attr('y', function(d) {
                return self.getYScale()(d.monthname) + 18;
            })
            .attr('x', function(d) {
                return 5;
            })
            .style('fill', '#e6e6e6');

    }

});

module.exports = barchart;
