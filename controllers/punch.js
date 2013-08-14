	var Employee = require('../models/employee').model;
	var PunchRecord = require('../models/punch_record').model;



	exports.put = function(req, res) {
		
		var type = req.param('type');
		Employee.findOne({
			'name': req.param('name')
		}, function(err, data) {

			if (err) {
				console.log(500);
				return res.json(500, {});
			}
			if (!data) {
				console.log(404);
				return res.json(404, {});
			}
			
			savePunch(data, type, function(rec) {				
				return res.render("home/index", {
					name: data.name,
					date: rec.punch,
					type: rec.type
				})
			});

		});

	};

	function savePunch(employee, type, callback) {
		var punchRecord = new PunchRecord({
			punch: new Date(),
			employee: employee,
			type: type
		});

		punchRecord.save(function(err, data) {
			if (err) {
				console.log(err);
			}
			callback(data);
		})

	}
	/*
var employee = new Employee({name:"Raymond Ho"});
	employee.save(function(err){
		if ( err ) {
			console.log(err);
			req.flash('error in creating model: '+err);
			return res.render('home/index', {name:"no name"});
		}
		res.render("home/index", {name:employee.name});
	})
	*/
	