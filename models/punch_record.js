var mongoose = require('mongoose');

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var PunchRecordSchema = new Schema({
	id: ObjectId,
	punch: Date,
	type: {type: String, enum: ['IN','OUT']},
	employee: String
});

exports.model = mongoose.model('PunchRecord', PunchRecordSchema, 'punch_record');