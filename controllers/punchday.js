	var Employee = require('../models/employee').model;
	var PunchDay = require('../models/punch_day_record').model;



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
		var punchIn = req.param('punchIn');
		var punchOut = req.param('punchOut');

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

	};