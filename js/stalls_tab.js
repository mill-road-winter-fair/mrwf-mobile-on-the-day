// Categories to show on the page
var shop_categories = [
	["Christmas","christmas"],
	["Textiles","textiles"],
	["Books", "books"],
	["Art/Papercraft", "arts"],
	["Jewellery", "jewellery"],
	["Ceramic & Glass", "pots"],
	["Woodcraft", "woodcraft"],
	["Cosmetics", "cosmetics"],
	["Charity", "charity"],
	["Community", "community"],
	["Nature / Environmental", "environmental"],
	["Drinks", "drinks"],
	["Gourmet", "gourmet"],
	["Street Food", "streetfood"],
	["Treats", "treats"],
];

// Render an individual shop element (also used by the search page)
function render_shop(shop, destination) {
	var data_attributes = "";
	shop_categories.forEach(function(catArray) {
		if (shop[catArray[1]]) {
			data_attributes += " data-" + catArray[1] + "=1";
		}
	});
	var contents = "<div data-location=\"" + shop.location + "\"" + data_attributes + " class=\"shop_elem\"><div class=\"shop_content\"><div class=\"shop_header\">";
	if (shop.url) {
		var protocol = shop.url.startsWith("https://") ? "https://": "http://";
		var url = shop.url.startsWith(protocol) ? shop.url.substring(protocol.length) : shop.url;
		contents += "<a target=\"_blank\" href=\"" + protocol + url + "\">";
	}
	contents += shop.name;
	if (shop.url) {
		contents += "</a>";
	}
	contents += "</div><div class=\"shop_location\">" + shop.location + "</div><p>" + shop.description + "</p></div></div>";
	destination.append($(contents));
}

$(document).ready(function() {
	// The container to show the shops as a grid.
	var grid = $("<div class=\"grid\" data-packery='{ \"itemSelector\": \".shop_elem\"}'></div>");

	// Add category filters to the navigation when activating this tab
	$("#shops-tab").on("show.bs.tab", function (e) {
		var filter= $("#mrwfFilters");
		filter.html("<li class=\"nav-item\"><a class=\"nav-link\" id=\"stalls-all\" href=\"#\">All</a></li>");
		shop_categories.forEach(function (catArray) {
			filter.append("<li class=\"nav-item\"><a class=\"nav-link stalls-filter\" href=\"#\" data-category=\"" + catArray[1] + "\">" + catArray[0] + "</a></li>");
		});
		// Have to add these handlers after we've added the filters to the navigation
		$("#stalls-all").click(function(e) {
			e.preventDefault();
			$("#shops .grid .shop_elem").show();
		});
		$(".stalls-filter").click(function(e) {
			e.preventDefault();
			var category = $(this).data("category");
			$("#shops .grid .shop_elem").each(function (i, item) {
				if ($(item).data(category)) {
					$(item).show();
				} else {
					$(item).hide();
				}
			});
		});
	});
	// Clear filters when moving away from this tab
	$("#shops-tab").on("hide.bs.tab", function (e) {
		var filter= $("#mrwfFilters");
		filter.html("");
	});

	// Parse a json data source for stalls
	function process_spreadsheet(data) {
		var entry = data.feed.entry;
		var searchables = [];
		// Parse the feed into standardized items (we get data from two different kinds of feed)
		$(entry).each(function(){
			var item = {
				name: this.gsx$name?this.gsx$name.$t:this.gsx$stallname.$t,
				description: this.gsx$stalldescription?this.gsx$stalldescription.$t:this.gsx$description.$t,
				url: this.gsx$url?this.gsx$url.$t:this.gsx$stallwebsite.$t,
				location: map_location(this.gsx$location.$t),
				// Add categories for filters
				arts: this.gsx$artpapercraft?!(!this.gsx$artpapercraft.$t):false,
				books: this.gsx$books?!(!this.gsx$books.$t):false,
				charity: this.gsx$charity?!(!this.gsx$charity.$t):false,
				christmas: this.gsx$christmas?!(!this.gsx$christmas.$t):false,
				community: this.gsx$community?!(!this.gsx$community.$t):false,
				environmental: this.gsx$natureenvironmental?!(!this.gsx$natureenvironmental.$t):false,
				jewellery : this.gsx$jewellery?!(!this.gsx$jewellery.$t):false,
				pots : this.gsx$ceramicglass?!(!this.gsx$ceramicglass.$t):false,
				textiles: this.gsx$textiles?!(!this.gsx$textiles.$t):false,
				woodcraft: this.gsx$woodcraft?!(!this.gsx$woodcraft.$t):false,
				cosmetics: this.gsx$cosmetics?!(!this.gsx$cosmetics.$t):false,
				drinks: this.gsx$drinks?!(!this.gsx$drinks.$t):false,
				gourmet: this.gsx$gourmet?!(!this.gsx$gourmet.$t):false,
				streetfood: this.gsx$streetfood?!(!this.gsx$streetfood.$t):false,
				treats: this.gsx$treats?!(!this.gsx$treats.$t):false
			};
			
			if (!item.location) return;
			searchables.push(item);
		});
		// Group by location then sort by name
		searchables.sort(function (a, b) {
			var location_diff = a.location.localeCompare(b.location);
			if (location_diff == 0) {
				return a.name.localeCompare(b.name);
			}
			return location_diff;
		});
		// Draw the sorted shops to the page
		searchables.forEach(function(item) {
			render_shop(item, grid);
		});
		// Add to the search indexes
		shop_map = searchables.map(function(item) {
			return { shop: item };
		});
		add_searchable_items(shop_map, ["shop.name", "shop.description", "shop.url", "shop.location"]);
	}

	function get_data () {
		// clear the tab
		$("#shops").html("");
		// process the stalls data into categories
		$.getJSON("https://spreadsheets.google.com/feeds/list/1M5nT__a2Hc8tR8tC8FCNWhthuEAtl2MjwXf89O5_Ba8/3/public/values?alt=json", process_spreadsheet);
		$.getJSON("https://spreadsheets.google.com/feeds/list/1M5nT__a2Hc8tR8tC8FCNWhthuEAtl2MjwXf89O5_Ba8/2/public/values?alt=json", process_spreadsheet);
		$("#shops").append(grid);
	}

	// query for data
	get_data();
});
