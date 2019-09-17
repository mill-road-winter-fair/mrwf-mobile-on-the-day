$(document).ready(function() {

	function render_event(event) {
		var contents = "<div class=\"shop_elem\"><div class=\"shop_content\"><div class=\"shop_header\">";
		if (event.url) {
			var protocol = event.url.startsWith("https://") ? "https://": "http://";
			var url = event.url.startsWith(protocol) ? event.url.substring(protocol.length) : event.url;
			contents += "<a target=\"_blank\" href=\"" + protocol + url + "\">";
		}
		contents += event.name;
		if (event.url) {
			contents += "</a>";
		}
		if (event.from) {
			if (event.to) {
				contents += "<p style=\"padding-top:10px;\">" + event.from + " - " + event.to + "</p>";
			}
			else {
				contents += "<p style=\"padding-top:10px;\">Starting " + event.from + "</p>";
			}
		}
		contents += "</div><div class=\"shop_location\">" + event.location + "</div><p>" + event.description + "</p></div></div>";
		$("#events").append($(contents));
	}

	function get_event_data () {
		//var spreadsheetID = "1R9VGdWmTecqviQ179A-QOOaWl3v1zm2Srgue09q0mqM";
		// process data
		var url = "https://spreadsheets.google.com/feeds/list/1LXsOH3khMduUrD65fcq2MpuiXEMbVaURlxvnPmsanvY/od6/public/values?alt=json";
		$.getJSON(url, function(data) {

			var entry = data.feed.entry;
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
				render_event(item);				
			});
		});
	}

	// query for data
	get_event_data();
});
