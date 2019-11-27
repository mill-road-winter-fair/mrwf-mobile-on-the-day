/**
This site is a mobile-first design using several tabs in one load, it means the
users load the site once and clicking through to other "pages" (actually tabs)
is much quicker.

Any tabs with hand-written copy in them will be in index.html. Any tabs which generate
their contents based on online data sources (typically google spreadsheets) will
load their information via the corresponding .js files in the background once the
core HTML has loaded.

The navigation is in two parts: a main navigation bar, which is the same everywhere
 and a tab-specific sub-navigation bar underneath. Any tabs that need to use
 sub-navigation build their own using javascript when their tab is shown and This
 navigation is kept at the top of the page using "sticky" javascript (not an
 industry-wide term, we just call it that here).

Since this is a mobile-first design it's important to consider phone screen space
when adding new elements (e.g. to navigation bars) and since this is all in one
page, css styles and div ids used for javascript should use tab-specific naming
*/
$(document).ready(function() {

	$("#map-tab").on("show.bs.tab", function (e) {
		var filter= $("#mrwfFilters");
		filter.html("");
		filter.append("<li class=\"nav-item\"><a class=\"nav-link events-filter\" href=\"#\" id=\"map-static\">Image</a></li>");
		filter.append("<li class=\"nav-item\"><a class=\"nav-link events-filter\" href=\"#\" id=\"map-google\">Google Map</a></li>");
		$("#map-static").click(function(e) {
			e.preventDefault();
			$("#map-img").show();
			$("#map-iframe").hide	();
		});
		$("#map-google").click(function(e) {
			e.preventDefault();
			$("#map-img").hide();
			$("#map-iframe").show();
		});
	});
	$("#map-tab").on("hide.bs.tab", function (e) {
		var filter= $("#mrwfFilters");
		filter.html("");
	});
	$("#map-iframe").hide();
});
