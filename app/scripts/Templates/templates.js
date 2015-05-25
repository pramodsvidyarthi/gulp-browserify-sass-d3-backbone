var templates = {};

templates.filterviewtemplate = ['<div class="row">',
    '<div class="col col_10 shiftleft_1 summary">',
    '<p>showing results for the year <em><b> <%= yr %></b></em></p>',
    '</div>',
    '</div>',
    '<div class="row">',
    '<div class="col col_4 year" id="prev">',
    '<span><i class="fa fa-chevron-circle-left"></i> Prev Year</span>',
    '</div>',
    '<div class="col col_4 shiftleft_4 year" id="next">',
    '<span>Next Year <i class="fa fa-chevron-circle-right"></i></span>',
    '</div>',
    '</div>',
    '<div class="row">',
    '<div class="col col_10 filtercategory">',
    '</div>',
    '</div>',
    '<div class="row">',
    '<div class="col col_10 filtertypes">',
    '</div>',
    '</div>'
].join('');

templates.dropdowntemplate = ["<div class='dropdown'>",
    "<a href='#' class='js-link'>All <%= viewname %> <i class='fa fa-chevron-down'></i></a>",
    "<ul class='js-dropdown-list'>",
    "</ul>",
    "</div>"
].join('');

templates.revisedfilterviewtemplate = ['<div class="row summary">',
    '<div class="col col_2">',
    '<i class="fa fa-angle-double-left fa-2x move" id="prev"></i>',
    '<p>Move by a year</p>',
    '</div>',
    '<div class="col col_2 shiftleft_4 shiftright_4">',
    '<p><%= year %></p> <i class="fa fa-angle-down fa-2x toggleyear"></i>',
    '</div>',
    '<div class="col col_2">',
    '<p>Move by a year</p>',
    '<i class="fa fa-angle-double-right fa-2x move" id="next"></i>',
    '</div>',
    '</div>',
    '<div class="row detailedfilters">',
    '<div class="col col_2 yearlist">',
    '</div>',
    '<div class="col col_10 shiftleft_1 tasktypelist">',
    '</div>',
    '</div>'].join('');

//pre-compiling templates
for (var key in templates) {
    if (templates.hasOwnProperty(key)) {
        templates[key] = _.template(templates[key]);
    }
};

module.exports = templates;
