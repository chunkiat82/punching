$(function() {
	moment().format();
	bind(); // Handler for .ready() called.
});

function bind() {
	$("a.punchLink").click(function(e) {

		e.preventDefault();

		var self = $(this);
		var link = self.attr("link");
		var type = self.attr("type");

		$.ajax({
			type: "POST",
			url: link,
			data: {
				"type": type
			},
			success: function(data) {
				var date = new Date(data.date);
				var day = moment(date);
				var text = '<p>' + day.format("Do MMM HH:mm:SS") + '</p>';
				//bootstrap_alert.alert(text, type);
				
				
			}
		});
		
		displayAndReset('<span class="label label-'+(type=='in'?'success':'danger')+'">Punched!</span>');

		function displayAndReset(htmlText){
			
			$('#punchName').html(htmlText);

			function setBack(){
				$('#punchName').html($('#punchName').attr('text'));
			}

			setTimeout(setBack,400);
		}
		
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
	$('#alert_placeholder').html('<div class="alert alert-success text-center">IN<span>' + message + '</span></div>')
}
bootstrap_alert.warning = function(message) {
	$('#alert_placeholder').html('<div class="alert alert-danger text-center">OUT<span>' + message + '</span></div>')
}