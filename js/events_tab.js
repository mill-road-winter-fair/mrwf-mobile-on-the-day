function render_event_icon(filename, message) {
	var icon_folder = "https://www.millroadwinterfair.org/assets/Uploads/icons";
	return "<img class=\"event-img\" src=\"" + icon_folder + "/" + filename + "\" alt=\"" + message + "\" title=\""+message + "\"/>";
}
function render_event_icons(event) {
	var contents = "";
	if (event.childfriendly) contents += render_event_icon("family-icon.png", "Child Friendly");
	if (event.art) contents += render_event_icon("art-icon.png", "Art Venue");
	if (event.toilets) contents += render_event_icon("toilet-icon.png", "Public Toilets");
	if (event.babychange) contents += render_event_icon("baby-change-icon.png", "Baby Changing Facilities");
	if (event.craft) contents += render_event_icon("craft-icon.png", "Stalls");
	if (event.indoors) contents += render_event_icon("indoor-icon.png", "Indoors");
	if (event.busking) contents += render_event_icon("busker-icon.png", "Busking");
	if (event.stage) contents += render_event_icon("stage-icon.png", "Stage");
	if (event.food) contents += render_event_icon("food-icon.png", "Food vendors");
	return contents;
}

function render_event(event, destination) {
	var contents = "";
	contents += "<div class=\"shop_elem\"";
	/** Adding data attributes to the widget */
	if (event.from) {
		contents += " data-from=\"" + event.from + "\"";
	}
	if (event.to) {
		contents += " data-to=\"" + event.to + "\"";
	}
	if (event.childfriendly) contents += " data-child-friendly=1";
	if (event.art) contents += " data-art=1";
	if (event.toilets) contents += " data-toilets=1";
	if (event.babychange) contents += " data-babychange=1";
	if (event.craft) contents += " data-craft=1";
	if (event.indoors) contents += " data-indoors=1";
	if (event.busking) contents += " data-busking=1";
	if (event.stage) contents += " data-stage=1";
	if (event.food) contents += " data-food=1";
	contents += ">";
	/** If there are relevant features, e.g. child friendly, show it as an icon here */
	contents += render_event_icons(event);
	contents += "<div class=\"shop_content\"><div class=\"shop_header\">";
	/** Name, with a link if we have one */
	if (event.url) {
		var protocol = event.url.startsWith("https://") ? "https://": "http://";
		if (event.url.includes('@')) {
			// it's an email so different approach is needed
			protocol = "mailto:";
		}
		var url = event.url.startsWith(protocol) ? event.url.substring(protocol.length) : event.url;
		contents += "<a target=\"_blank\" href=\"" + protocol + url + "\">";
	}
	contents += event.name;
	if (event.url) {
		contents += "</a>";
	}
	/* Location */
	contents += "</div><div class=\"shop_location\">" + event.location + "</div>";
	/** Event time if relevant */
	if (event.from) {
		if (event.to) {
			contents += "<p>" + event.from + " - " + event.to + "</p>";
		}
		else {
			contents += "<p>Starting " + event.from + "</p>";
		}
	}
	// Web copy
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
		filter.append("<li class=\"nav-item\"><a class=\"nav-link events-filter\" href=\"#\" id=\"event-for-children\">For Children</a></li>");
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
		$("#event-for-children").click(function(e) {
			e.preventDefault();
			$("#events .grid .shop_elem").each(function (i, item) {
				if ($(item).data("child-friendly")) {
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
		// process data
		var url = "https://spreadsheets.google.com/feeds/list/14AMZw9loQJWnYv3HdRJ5MRfjYppBLHNt0Ntcub8J6UM/od6/public/values?alt=json";
		$.getJSON(url, function(data) {

			var entry = data.feed.entry;
			var items = [];
	 		$("#events").html("");
			$(entry).each(function(){
				var item = {
					name: this.gsx$title.$t,
					description: this.gsx$description.$t,
					url: this.gsx$url.$t,
					location: map_location(this.gsx$location.$t),
					// properties used to show icons of interest to the user
					childfriendly: this.gsx$forchildren?!(!this.gsx$forchildren.$t):false,
					art: this.gsx$art?!(!this.gsx$art.$t):false,
					toilets: this.gsx$toilets?!(!this.gsx$toilets.$t):false,
					babychange: this.gsx$babychange?!(!this.gsx$babychange.$t):false,
					craft: this.gsx$craft?!(!this.gsx$craft.$t):false,
					indoors: this.gsx$indoors?!(!this.gsx$indoors.$t):false,
					busking: this.gsx$busking?!(!this.gsx$busking.$t):false,
					stage: this.gsx$stage?!(!this.gsx$stage.$t):false,
					food: this.gsx$food?!(!this.gsx$food.$t):false,
					unaffiliated: this.gsx$sep?!(!this.gsx$sep.$t):false,
				};
				if (this.gsx$to.$t) {
					item.to = this.gsx$to.$t;
				}
				if (this.gsx$from.$t) {
					item.from = this.gsx$from.$t;
				}
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
