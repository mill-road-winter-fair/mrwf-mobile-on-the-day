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
