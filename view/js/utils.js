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
	res += (values[i] + measures[i]);
	if(values[i+1] > 0) {
		res += (" " + values[i+1] + measures[i+1]);
	}
	return res;
}