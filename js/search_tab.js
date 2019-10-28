$(document).ready(function() {

	$("#search-box-button").click(function(e) {
		// Take the contents of the search box
		var text = $("#search-box-input").val();
		var results = do_search(text);
		$("#search").html("Searching for <div class=\"search-term\">" + text + "</div> found " + results.length + " results");
		for(var i=0; i < results.length; i++) {
			item = results[i];
			if (item.shop) {
				render_shop(item.shop, $("#search"));
			} else if (item.performance) {
				render_performance(item.performance, $("#search"));
			} else if (item.event) {
				render_event(item.event, $("#search"));
			}
		}
		// display the search tab
		$('.nav-item a[href="#search"]').tab("show");
	});
});
