	var Employee = require('../models/employee').model;
	var PunchRecord = require('../models/punch_record').model;
	var PunchDayRecord = require('../models/punch_day_record').model;

	exports.read = function(req, res) {

		var id = req.param('id');
		console.log(id);

		Employee.findOne({
			_id: id
		}, function(err, data) {

			if (err) {
				console.log(500);
				return res.json(500, {});
			}
			if (!data) {
				var employee = new Employee({
					_id: id
				});
				employee.save(function(err, data) {
					if (err) {
						console.log(err);
						return res.render('employee/index', {
							name: "no name"
						});
					}
					return res.render("employee/index", {
						name: data._id
					});
				});
			} else {
				return res.render("employee/index", {
					name: data._id
				});
			}

		});

	}

	exports.punch = function(req, res) {

		var type = req.param('type').toUpperCase();
		var id = req.param('id');
		var now = new Date();
		var today = new Date(new Date(now).setHours(0, 0, 0, 0));
		console.log("now and today");
		console.log(now);
		console.log(today);
		console.log("now and today");
		Employee.findOne({
			_id: id
		}, function(err, data) {

			if (err) {
				console.log(500);
				return res.json(500, {});
			}
			if (!data) {
				console.log(404);
				return res.json(404, {});
			}

			savePunch(function() {
				console.log('punch recorded');

			});

		});

		return res.render("employee/index", {
			name: id,
			date: now,
			type: type
		});

		function savePunch(callback) {


			var punchRecord = new PunchRecord({
				punch: now,
				employee: id,
				type: type
			});

			punchRecord.save(function(err, data) {
				if (err) {
					console.log(err);
				}
				saveUpdatePunchDate();
				callback();
			})

		}

		function saveUpdatePunchDate() {

			var pdRec = PunchDayRecord.findOne({
				'employee': id,
				'today': today
			}).exec();

			pdRec.then(function(rec) {
				console.log('pdRec entered');

				if (rec == null) {
					var pdRec = new PunchDayRecord({
						today: today,
						punchIn: now,
						punchOut: now,
						employee: id
					});
					pdRec.save(function(err, data) {
						if (err) {
							console.log(err);
						}
					})
				} else {
					if (type='OUT')
					PunchDayRecord.update({
						_id: rec._id
					}, {
						$set: {
							punchOut: now
						}
					}).exec();
				}



			})
		}

	};

	exports.reportDetails = function(req, res) {
		var id = req.param('id');

		PunchRecord.find({
			'employee': id
		}).exec(function(err, recs) {
			if (err) console.log(err);

			return res.render("employee/report", {
				records: recs
			});
		});


		var o = {};
		o.map = function() {
			emit(this.employee, this.punch)
		}
		o.reduce = function test(k, vals) {

			var results = [];

			var min = vals[0];
			var max = min;
			var date = new Date(max);
			date.setHours(0, 0, 0, 0);
			var minMax = {};
			minMax.min = min;
			minMax.max = max;
			results[0] = 'sdfsdfsd';
			/*for (var i = 1; i < vals.length; i++) {
				var current = vals[i];
				var currentDate = new Date(current);
				currentDate.setHours(0, 0, 0, 0);
				if (min > current) {
					min = current;
				}
				if (max < current) {
					if (date < currentDate) {
						var minMax = {};
						minMax.min = min;
						minMax.max = max;
						//results.push(minMax);						
						date = currentDate;
					}
					max = current;
				}

			}*/
			//http://docs.mongodb.org/manual/core/map-reduce/
			var x = [minMax, minMax];
			return x;
		}
		o.out = {
			replace: 'minTime1'
		}
		o.verbose = true;
		PunchRecord.mapReduce(o, function(err, model, stats) {
			console.log('map reduce took %d ms', stats.processtime)
			//model.find().where('value').gt(10).exec(function(err, docs) {
			//	console.log(docs);
			//});
			if (err) {
				console.log("an error took place");
				console.log(err);
			}
			model.find().exec(function(err, docs) {
				if (err) {
					console.log("an error took place");
					console.log(err);
				}
				console.log(docs);
			});
		});


	}

	exports.report = function(req, res) {
		console.log('report function');
		var id = req.param('id');

		var records = PunchDayRecord.find({
			'employee': id
		}).exec(function(err, recs) {		
			return res.render("employee/report", {
				records: recs
				,name:id
			});
		});



	}