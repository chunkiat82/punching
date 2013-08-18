	var Employee = require('../models/employee').model;
	var PunchDay = require('../models/punch_day_record').model;
	var moment = require('moment');
	moment().format();


	exports.read = function(req, res) {

		var id = req.param('id');
		PunchDay.findOne({
			'_id': id
		}, function(err, data) {

			if (err) {
				console.log(500);
				return res.json(500, {});
			}
			if (!data) {
				console.log(404);
				return res.json(404, {});
			}

			console.log(data);
			return res.render("punchday/index", data);

		});

	};

	exports.update = function(req, res) {

		var id = req.param('id');
		var today = req.param('today');
		var punchIn = req.param('punchIn');
		var punchOut = req.param('punchOut');

		console.log(today+" from input");
		punchIn = addTimeToMoment(today,punchIn);
		punchOut = addTimeToMoment(today,punchOut);

		punchIn = punchIn.toDate();
		punchOut = punchOut.toDate();

		PunchDay.findOneAndUpdate({
			'_id': id
		}, {
			punchIn: punchIn,
			punchOut: punchOut
		}, {}, function(err, data) {

			if (err) {
				console.log(500);
				return res.json(500, {});
			}
			if (!data) {
				console.log(404);
				return res.json(404, {});
			}

			console.log(data);
			res.redirect('/punchday/' + id);

		});

		function addTimeToMoment(input,timeInStr){
			var today = moment(input);
			var n=timeInStr.split(":");
			console.log(today);
			console.log(n);
			today.add('hours', n[0]);
			today.add('minutes', n[1]);
			today.add('seconds', n[2]);

			return today;
		}

	};