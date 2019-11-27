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

	$("#search-box-button").click(function(e) {
		// Take the contents of the search box
		var text = $("#search-box-input").val();
		var results = do_search(text);
		$("#search").html("Searching for <div class=\"search-term\">" + text + "</div> found " + results.length + " results");
		var grid = $("<div class=\"grid\" data-packery='{ \"itemSelector\": \".shop_elem\" }'></div>");
		for(var i=0; i < results.length; i++) {
			item = results[i];
			if (item.shop) {
				render_shop(item.shop, grid);
			} else if (item.performance) {
				render_performance(item.performance, grid);
			} else if (item.event) {
				render_event(item.event, grid);
			}
		}
		$("#search").append(grid);
		// display the search tab
		$('.nav-item a[href="#search"]').tab("show");
	});
});
