export function formatDate(value) {
	var date = new Date(value * 1000);
	var month = date.getMonth() + 1;
	var hours = date.getHours();
	if (hours < 10)
		hours = "0" + hours;
	var minutes = date.getMinutes();
	if (minutes < 10)
		minutes = "0" + minutes;
	var time = date.getFullYear() + "-" + month + "-" + date.getDate() +
		" " + hours + ":" + minutes;
	return time;
}
