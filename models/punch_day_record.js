var mongoose = require('mongoose');

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var PunchDayRecordSchema = new Schema({
	id: ObjectId,
	today:Date,
	punchIn: Date,
	punchOut:Date,	
	employee: String
});
//need some valiation between today and punch in and punch out
PunchDayRecordSchema.pre('save', function(next){
  self = this;
  self.today.setHours(0,0,0,0);
  next();
})
exports.model = mongoose.model('PunchDayRecord', PunchDayRecordSchema, 'punch_day_record');
