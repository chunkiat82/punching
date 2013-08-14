var express = require('express');
var app = express();
var requireDir = require('require-dir');
var routes = requireDir('./controllers');
var models = requireDir('./models');
var mongoStore = require('connect-mongo')(express);
var dust = require('dustjs-linkedin');
dust.helper = require('dustjs-helpers');
var cons = require('consolidate');
require("mongoose").connect('localhost', 'soho_punch');
var moment = require('moment');
moment().format();

var quotes = [
  { author : 'Audrey Hepburn', text : "Nothing is impossible, the word itself says 'I'm possible'!"},
  { author : 'Walt Disney', text : "You may not realize it when it happens, but a kick in the teeth may be the best thing in the world for you"},
  { author : 'Unknown', text : "Even the greatest was once a beginner. Don't be afraid to take that first step."},
  { author : 'Neale Donald Walsch', text : "You are afraid to die, and you're afraid to live. What a way to exist."}
];

dust.helpers['formatDate'] = function (chunk, context, bodies, params) {
    var value = dust.helpers.tap(params.value, chunk, context);
    var format = dust.helpers.tap(params.format, chunk, context);
    var date = moment(value);

    //"Do MMM YYYY"
    if (format == null){
        format = "Do MMM YYYY"
    }
    return chunk.write(date.format(format));
};

dust.helpers['formatCalendar'] = function (chunk, context, bodies, params) {
    var value = dust.helpers.tap(params.value, chunk, context); 
    var date = moment(value);

    return chunk.write(date.calendar());
};

app.engine('dust', cons.dust);


app.configure(function() {
    app.set('port', process.env.SOHOMAILPORT || 4730);
    app.set('view engine', 'dust');
    app.set('views', __dirname + '/views');
    app.set('root', __dirname);
    app.use(express.static(__dirname + '/public', {
        redirect: false
    }));
    app.use(express.cookieParser());
    app.use(express.session({
        secret: 'punch',
        store: new mongoStore({
            db: 'soho_punch'
        })
    }));
    app.use(express.bodyParser());
    app.use(app.router);
});

app.get('/employee/:id', routes.employee.read);
app.get('/employee/:id/punch', routes.employee.read);
//ideally there is action mapped to type
app.post('/employee/:id/punch/:type', routes.employee.punch);
app.get('/employee/:id/report', routes.employee.report);
app.get('/employee/:id/reportdetails', routes.employee.reportDetails);

app.listen(app.get('port'));

//NEXT IS MODEL
//MODEL DB
//CRUD
