$(document).ready(function() {

	var shops = [];

	function render_shop(shop) {
		var contents = "<div class=\"shop_elem\"><div class=\"shop_content\"><div class=\"shop_header\">";
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
		$("#shops").append($(contents));
	}

	function process_spreadsheet(data) {
		var entry = data.feed.entry;
			 
		$(entry).each(function(){
			var item = {
				name: this.gsx$name?this.gsx$name.$t:this.gsx$stallname.$t,
				description: this.gsx$stalldescription?this.gsx$stalldescription.$t:this.gsx$description.$t,
				url: this.gsx$url?this.gsx$url.$t:this.gsx$stallwebsite.$t,
				location: map_location(this.gsx$location.$t)
				// TODO add properties for filters
			};

			if (!item.location) return;
			shops.push(item);
			render_shop(item);
		});
	}

	function get_data () {
		// clear the tab
		$("#shops").html("");
		// process the stalls data into categories
		$.getJSON("https://spreadsheets.google.com/feeds/list/1XL5sVmJbLyYYkSrwayyKRBNxkiVxXWbZTUXNdaD6Eu8/od6/public/values?alt=json", process_spreadsheet);
		$.getJSON("https://spreadsheets.google.com/feeds/list/1kKJSpomSOHyGAO-Y3JRIfGvMs7S5TeVKLEewLEiBeK0/od6/public/values?alt=json", process_spreadsheet);
	}

	// query for data
	get_data();
});
