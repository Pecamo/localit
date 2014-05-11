/** Returns the two biggest neighbour units of day/hours/minutes/seconds.
 * Returns nothing if there is less than one minute.
 */
function toSMH(s) {
	var days = Math.floor(s / 86400);
	s%= 86400;
	var hours = Math.floor(s / 3600);
	s %= 3600;
	var minutes = Math.floor(s / 60);
	var seconds = s % 60;
	var res = "";
	var measures = ["d", "h", "m", "s"];
	var values = [days, hours, minutes, seconds];
	for(var i = 0; i < values.length-1; ++i) {
		if(values[i] > 0) {
			res = addTwoLast(values, measures, i);
			break;
		}
		else if(i == values.size-2) {
			res = addTwoLast(values, measures, i);
		}
	}
	
	return res;
}

function addTwoLast(values, measures, i) {
	var res = "";
	res += (Math.round(values[i]) + measures[i]);
	if(values[i+1] > 0) {
		res += (" " + Math.round(values[i+1]) + measures[i+1]);
	}
	return res;
}

function computeDistance(lat1, lon1, lat2, lon2) {
	var R = 6371; // earth radius
	var dLat = (lat2-lat1)* Math.PI / 180;;
	var dLon = (lon2-lon1)* Math.PI / 180;;
	var lat1 = lat1 * Math.PI / 180;;
	var lat2 = lat2 * Math.PI / 180;;

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c;
	return Math.round(d * 10) / 10;
}

function parseDate(s) {
	var parts = s.split('T');
	var YMD = parts[0].split('-');
	var HMS = parts[1].split(':');
	return new Date(YMD[0], YMD[1]-1, YMD[2], HMS[0], HMS[1], HMS[2]);
}