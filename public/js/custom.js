$(function() {
	moment().format();
	bind(); // Handler for .ready() called.

});

function bind() {
	$("a.punchLink").click(function(e) {

		e.preventDefault();

		var self = $(this);
		var link = self.attr("href");
		var reportLink = self.attr("reportLink");
		var type = self.attr("type");

		$.post(link, function(data) {
			console.log("punched");
			console.log(data);
			var text='<a href="'+reportLink+'">Report</a>';
			var date = new Date(data.date);

			var day = moment(date);
			text = '<p>'+day.format("Do MMM HH:MM:SS") + '</p>'+ text;
			bootstrap_alert.alert(text, type);
		});
	});


}

bootstrap_alert = function() {}
bootstrap_alert.alert = function(message, type) {
	if (type == 'in') {
		bootstrap_alert.info(message);
	} else {
		bootstrap_alert.warning(message);
	}
}
bootstrap_alert.info = function(message) {
	$('#alert_placeholder').html('<div class="alert alert-success text-center"><a class="close" data-dismiss="alert">×</a><span>' + message + '</span></div>')
}
bootstrap_alert.warning = function(message) {
	$('#alert_placeholder').html('<div class="alert alert-danger text-center"><a class="close" data-dismiss="alert">×</a><span>' + message + '</span></div>')
}