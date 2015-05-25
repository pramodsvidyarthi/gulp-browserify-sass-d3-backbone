function d3Tooltip() {
  function chart(selection) {
    selection.each(function(data) {
      	
      var target = d3.select(this);
      
      target.on('mouseover.tooltip', function(d) {
        d3.select(this).call(create);
      });
      
      target.on('mousemove.tooltip', function(d) {
        // console.log('moving');
          d3.select(this).call(update);
      });
      
      target.on('mouseout.tooltip',  function(d) {
        d3.select(this).call(remove);
      });
      
    });
  }
  
  function create(selection) {
    selection.each(function(d) {
      // console.log(d);
      var body = d3.select('body'),
          tip = body.selectAll('.d3-tooltip').data([d]);

     	tip.enter().append('div')
        .classed('d3-tooltip', true)
        .html(function(d){
          var str="<ul>";
          if(d.tasktypes){
            for(var key in d.tasktypes){
              str+="<li>"+key+" - <span>"+d.tasktypes[key]+"</span></li>";
            }
          } else if(d.tasktypesbreakdown){
             for(var key in d.tasktypesbreakdown){
              str+="<li>"+key+" - <span>"+d.tasktypesbreakdown[key]+"</span></li>";
            }
          } else {
            str+="<li>"+d.name+" - <span>"+d.count+"</span></li>";
          }

          str+="</ul>";
          return str;
        });

        // tip
        // .style('left', d3.event.pageX - 50 + 'px')
        // .style('top',  d3.event.pageY - 30+ 'px');
      
    });
  }
  
  function update(selection) {
    selection.each(function(d) {
    	var body = d3.select('body'),
          tip = body.selectAll('div.d3-tooltip').data([d]);
      
			var width  = parseInt(tip.style('width'), 10);
			var height = parseInt(tip.style('height'), 10);

      // Compute the tooltip position
      var dx = +d3.event.pageX - 20,
          dy = (+d3.event.pageY < document.body.scrollHeight*65/100) ? +d3.event.pageY - 0.1 * height :  +d3.event.pageY - 0.9 * height;

      tip
        .style('left', dx + 'px')
        .style('top',  dy + 'px');
    });
  }
  
  function remove(selection) {
    selection.each(function(d) {
      
      var body = d3.select('body'),
          tip = d3.selectAll('div.d3-tooltip').data([d]);
      
      tip.remove();
      // tip.style('display', 'none');
      
    });
  }
  
  return chart;
}


// Create the tooltip
 module.exports = d3Tooltip();

// var svg = d3.select('svg'),
//     rect = svg.selectAll('rect').data([0, 1, 2]);

// Add the tooltip behaviour to the rectangles
// rect.call(tip); 

