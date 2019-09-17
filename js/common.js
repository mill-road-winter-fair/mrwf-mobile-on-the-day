function filterColumn(thing, prop) {
	return thing.hasOwnProperty("gsx$" + prop) && (thing["gsx$" + prop].$t == "X" || thing["gsx$" + prop].$t == "x");
}	

function map_location(rawloc) {
	switch(rawloc.toLowerCase()) {
		case "d g out":
		case "dg out":
			return "Donkey Green Outside";
		case "ditchburn":	
			return "Ditchburn Gardens";
		case "dg Marquee":
		case "dg Marquee x 2":
			return "Donkey Green Marquee";
		case "depot":
			return "Outside Bharat Bhavan";
		case "gt eastern":
			return "Great Eastern Street Car Park";
		case "lifecraft":
			return "Lifecraft - Gwydir Street";
		case "romsey":
			return "Mill Road - Romsey";
		case "petersfield":
		case "4 counties":
			return "Mill Road - Petersfield";
		case "regent":
			return "Regent Language School - By The Bridge";
		case "barn":
			return "St. Barnabas Road";
		case "gwydir":
			return "Gwydir Street Car Park";
	}	
	return rawloc;
}

function update_nav(self) {
	$(".cat_nav").css("color", "#C90");
	$(".cat_nav").data("orig-color", "#C90");
	$(".cat_nav").hover(function() {
		$(this).css("color", "#C52724");
	}, function() {
		var colour = $(this).data("orig-color");
		$(this).css("color", colour);
	});
	self.data("orig-color", "#C52724");
	self.css("color", "#C52724");
}

