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
