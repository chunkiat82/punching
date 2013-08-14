var mongoose = require('mongoose');

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var EmployeeSchema = new Schema({
	_id: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true
	},
	firstName: String,
	lastName: String
});

exports.model = mongoose.model('Employee', EmployeeSchema, 'employee');