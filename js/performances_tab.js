$(document).ready(function() {

	var performers = [];
	var events = [];

	function render_event(event) {
		var contents = "<div class=\"shop_elem\"><div class=\"shop_content\"><div class=\"shop_header\">";
		if (event.performer&&event.performer.url) {
			var protocol = event.performer.url.startsWith("https://") ? "https://": "http://";
			var url = event.performer.url.startsWith(protocol) ? event.performer.url.substring(protocol.length) : event.performer.url;
			contents += "<a target=\"_blank\" href=\"" + protocol + url + "\">";
		}
		contents += event.name;
		if (event.performer&&event.performer.url) {
			contents += "</a>";
		} 
		contents += "</div><div class=\"shop_location\">" + event.location + "</div><p>"+ event.from;
		if (event.to) {
			contents += " - " + event.to;
		}
		contents += "</p>";
		if (event.performer) {
			contents += "<p>" + event.performer.description + "</p>";
			if (event.performer.events.length > 1) {
				contents += "<p>Also performing at:</p>";
				for (var i in event.performer.events) {
					var otherEvent = event.performer.events[i];
					if (otherEvent.from != event.from) {
						contents += "<p>" + otherEvent.location + "<br />" + otherEvent.from;
						if (otherEvent.to) {
							contents += " - " + otherEvent.to;
						}
						contents += "</p>";
					}
				}
			}
		}
		contents += "</div></div>";
		$("#performances").append($(contents));
	}			

	function get_music_data () {
		// first get all the performers.
		var url = "https://spreadsheets.google.com/feeds/list/1lE6NhqbzP8LxCpbQdRHDE-EnQ0dxSGOuxSSVznYLYUo/od6/public/values?alt=json";
		$("#performances").html("");
		$.getJSON(url, function(data) {
			var entry = data.feed.entry;
			$(entry).each(function(){
				performers.push({
					name: this.title.$t,
					description: this.gsx$description.$t,
					url: this.gsx$url.$t,
					// tracking events this performer is at
					events: []
				});
			});

			// then get the times and locations of their performances
			var timesUrl = "https://spreadsheets.google.com/feeds/list/1wWkjauTsBuTCWG1hjW5xJB9XizO8YHR07vkL-9SG6x0/od6/public/values?alt=json";
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
							performer.events.push(item);
							break;
						}
					}
					events.push(item);
				});
				// now that's done, render them all
				events.forEach(function(event) {
					render_event(event);
				});
			});		
		});
	}
	// query for data
	get_music_data();
});
