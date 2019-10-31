function render_event(event, destination) {
	var contents = "<div class=\"shop_elem\"" + (event.from?" data-from=\"" + event.from + "\"":"") + "" + (event.to?" data-to=\"" + event.to + "\"":"") +"><div class=\"shop_content\"><div class=\"shop_header\">";
	if (event.url) {
		var protocol = event.url.startsWith("https://") ? "https://": "http://";
		var url = event.url.startsWith(protocol) ? event.url.substring(protocol.length) : event.url;
		contents += "<a target=\"_blank\" href=\"" + protocol + url + "\">";
	}
	contents += event.name;
	if (event.url) {
		contents += "</a>";
	}
	contents += "</div><div class=\"shop_location\">" + event.location + "</div>";
	if (event.from) {
		if (event.to) {
			contents += "<p>" + event.from + " - " + event.to + "</p>";
		}
		else {
			contents += "<p>Starting " + event.from + "</p>";
		}
	}
	contents += "<p>" + event.description + "</p></div></div>";
	destination.append($(contents));
}

$(document).ready(function() {
	var grid = $("<div class=\"grid\" data-packery='{ \"itemSelector\": \".shop_elem\" }'></div>");

	$("#events-tab").on("show.bs.tab", function (e) {	
		var filter= $("#mrwfFilters");
		filter.html("");
		filter.append("<li class=\"nav-item\"><a class=\"nav-link events-filter\" href=\"#\" id=\"event-all\">All</a></li>");
		filter.append("<li class=\"nav-item\"><a class=\"nav-link events-filter\" href=\"#\" id=\"event-morning\">Morning</a></li>");
		filter.append("<li class=\"nav-item\"><a class=\"nav-link events-filter\" href=\"#\" id=\"event-afternoon\">Afternoon</a></li>");
		filter.append("<li class=\"nav-item\"><a class=\"nav-link events-filter\" href=\"#\" id=\"event-all-day\">All Day</a></li>");
		$("#event-all").click(function(e) {
			e.preventDefault();
			$("#events .grid .shop_elem").show();
		});

		$("#event-morning").click(function(e) {
			e.preventDefault();
			$("#events .grid .shop_elem").each(function (i, item) {
				if ($(item).data("from")&&$(item).data("from") < "12:00") {
					$(item).show();
				} else {
					$(item).hide();
				}
			});		
		});
		$("#event-all-day").click(function(e) {
			e.preventDefault();
			$("#events .grid .shop_elem").each(function (i, item) {
				if ($(item).data("from")) {
					$(item).hide();
				} else {
					$(item).show();
				}
			});		
		});
		$("#event-afternoon").click(function(e) {
			e.preventDefault();
			$("#events .grid .shop_elem").each(function (i, item) {
				if ($(item).data("from")&&$(item).data("from") > "12:00"||$(item).data("to")&&$(item).data("to") > "12:00") {
					$(item).show();
				} else {
					$(item).hide();
				}
			});		
		});
	});
	$("#events-tab").on("hide.bs.tab", function (e) {	
		var filter= $("#mrwfFilters");
		filter.html("");
	});

	function get_event_data () {
		//var spreadsheetID = "1R9VGdWmTecqviQ179A-QOOaWl3v1zm2Srgue09q0mqM";
		// process data
		var url = "https://spreadsheets.google.com/feeds/list/1LXsOH3khMduUrD65fcq2MpuiXEMbVaURlxvnPmsanvY/od6/public/values?alt=json";
		$.getJSON(url, function(data) {

			var entry = data.feed.entry;
			var items = [];
	 		$("#events").html("");
			$(entry).each(function(){
				var item = {
					name: this.gsx$title.$t,
					description: this.gsx$description.$t,
					url: this.gsx$url.$t,
					location: map_location(this.gsx$location.$t)
				};
				
				if (this.gsx$to.$t) {
					item.to = this.gsx$to.$t;
				}
				if (this.gsx$from.$t) {
					item.from = this.gsx$from.$t;
				}
				// TODO add info for filters?
				items.push(item);
			});
			items.sort(function(a, b) {
				if (a.from) {
					if (b.from) {
						var time_diff = a.from.localeCompare(b.from);
						if (time_diff == 0) {
							return a.name.localeCompare(b.name);
						}
						return time_diff;
					}
					return -1;
				}
				if (b.from) {
					return 1;
				}
				return a.name.localeCompare(b.name);
			});
			items.forEach(function (item) {
				render_event(item, grid);				
			});
			events_map = items.map(function(item) {
				return { event: item };
			});
			// Add to the search indexes
			add_searchable_items(events_map, ["event.name", "event.description"]);
			$("#events").append(grid);
		});
	}

	// query for data
	get_event_data();
});
