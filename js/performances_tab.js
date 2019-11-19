// Render an individual performance on the page (also used by the search page)
function render_performance(performance, destination) {
	// Something went wrong
	if (!performance.performer) {
		console.log("No performer", performance);
		return;
	}
	var contents = "<div class=\"shop_elem\" data-from=\"" + performance.from + "\" data-to=\"" + performance.to + "\">";
	if (performance.performer.image) {
		contents += "<img class=\"performer-img\" src=\"" + performance.performer.image + "\"/>";
	}
	contents += "<div class=\"shop_content\"><div class=\"shop_header\">";
	if (performance.performer&&performance.performer.url) {
		var protocol = performance.performer.url.startsWith("https://") ? "https://": "http://";
		var url = performance.performer.url.startsWith(protocol) ? performance.performer.url.substring(protocol.length) : performance.performer.url;
		contents += "<a target=\"_blank\" href=\"" + protocol + url + "\">";
	}
	contents += performance.name;
	if (performance.performer&&performance.performer.url) {
		contents += "</a>";
	}
	contents += "</div><div class=\"shop_location\">" + performance.location + "</div><p>"+ performance.from;
	if (performance.to) {
		contents += " - " + performance.to;
	}
	contents += "</p>";
	if (performance.performer) {
		contents += "<p>" + performance.performer.description + "</p>";
		/* List other performances this performer is doing.
		if (performance.performer.performances.length > 1) {
			contents += "<p>Also performing at:</p>";
			for (var i in performance.performer.performances) {
				var otherperformance = performance.performer.performances[i];
				if (otherperformance.from != performance.from) {
					contents += "<p>" + otherperformance.location + "<br />" + otherperformance.from;
					if (otherperformance.to) {
						contents += " - " + otherperformance.to;
					}
					contents += "</p>";
				}
			}
		}
		*/
	}
	contents += "</div></div>";
	destination.append($(contents));
}

$(document).ready(function() {

	var performers = [];
	var performances = [];
	var grid = $("<div class=\"grid\" data-packery='{ \"itemSelector\": \".shop_elem\" }'></div>");
	var time_slots = [
		["10am", "10"],
		["11am", "11"],
		["12pm", "12"],
		["1pm", "13"],
		["2pm", "14"],
		["3pm", "15"],
		["4pm", "16"]
	];

	$("#performances-tab").on("show.bs.tab", function (e) {
		var filter= $("#mrwfFilters");
		filter.html("");
		filter.append("<li class=\"nav-item\"><a class=\"nav-link\" href=\"#\" id=\"performances-all\">All</a></li>");
		time_slots.forEach(function (catArray) {
			filter.append("<li class=\"nav-item\"><a class=\"nav-link performances-filter\" href=\"#\" data-time=\"" + catArray[1] + "\">" + catArray[0] + "</a></li>");
		});
		$("#performances-all").click(function(e) {
			e.preventDefault();
			$("#performances .grid .shop_elem").show();
		});
		$(".performances-filter").click(function(e) {
			e.preventDefault();
			var time = $(this).data("time");
			$("#performances .grid .shop_elem").each(function (i, item) {
				if ($(item).data("from").startsWith(time) || $(item).data("to").startsWith(time)) {
					$(item).show();
				} else {
					$(item).hide();
				}
			});
		});
	});



	$("#performances-tab").on("hide.bs.tab", function (e) {
		var filter= $("#mrwfFilters");
		filter.html("");
	});
	function get_music_data () {
		// first get all the performers.
		var url = "https://spreadsheets.google.com/feeds/list/1AEWvsdzdom0ZduRJK2DnUGVWUo_1UG4L8iXPPMgKwh4/od6/public/values?alt=json";
		$("#performances").html("");
		$.getJSON(url, function(data) {
			var entry = data.feed.entry;
			$(entry).each(function(){
				performers.push({
					name: this.title.$t,
					description: this.gsx$description.$t,
					url: this.gsx$url.$t,
					image: this.gsx$image?this.gsx$image.$t:'',
					// tracking performances this performer is at
					performances: []
				});
			});

			// then get the times and locations of their performances
			var timesUrl = "https://spreadsheets.google.com/feeds/list/1escaqwhaWJ9OeTKJJ8s23Tw6A7IRdDWxsi7nOMeaT0c/od6/public/values?alt=json";
			$.getJSON(timesUrl, function(data) {
				var entry = data.feed.entry;
				$(entry).each(function() {
					var item = {
						name: this.gsx$name.$t,
						from: this.gsx$from.$t,
						location: map_location(this.gsx$location.$t)
					};
					if (this.gsx$to.$t) {
						item.to = this.gsx$to.$t;
					}
					// scan over all the performers we've identified to see if we can get a description
					for (var index in performers) {
						var performer = performers[index];
						if (performer.name == item.name) {
							item.performer = performer;
							performer.performances.push(item);
							break;
						}
					}
					performances.push(item);
				});
				performances.sort(function(a, b) {
					return a.from.localeCompare(b.from);
				});
				// now that's done, render them all
				performances.forEach(function(performance) {
					render_performance(performance, grid);
				});

				performances_map = performances.map(function(item) {
					return { performance: item };
				});
				// Add to the search indexes
				add_searchable_items(performances_map, ["performance.name", "performance.from", "performance.performer.name", "performance.performer.description"]);
			});
			$("#performances").append(grid);
		});
	}
	// query for data
	get_music_data();
});
