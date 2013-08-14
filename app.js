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

var quotes = [
  { author : 'Audrey Hepburn', text : "Nothing is impossible, the word itself says 'I'm possible'!"},
  { author : 'Walt Disney', text : "You may not realize it when it happens, but a kick in the teeth may be the best thing in the world for you"},
  { author : 'Unknown', text : "Even the greatest was once a beginner. Don't be afraid to take that first step."},
  { author : 'Neale Donald Walsch', text : "You are afraid to die, and you're afraid to live. What a way to exist."}
];

dust.helpers['formatDate'] = function (chunk, context, bodies, params) {
    var value = dust.helpers.tap(params.value, chunk, context),
        timestamp,
        month,
        date,
        year,
        seconds,
        minutes,
        hours;
    
    timestamp = new Date(value);
    month = timestamp.getMonth() + 1;
    date = timestamp.getDate();
    year = timestamp.getFullYear();
    seconds = timestamp.getSeconds();
    minutes = timestamp.getMinutes();
    hour = timestamp.getHours();

    return chunk.write(date + '/' + month + '/' + year + ' ' + hour + ':' + minutes + ':' + seconds);
};

dust.helpers['formatTime'] = function (chunk, context, bodies, params) {
    var value = dust.helpers.tap(params.value, chunk, context),
        timestamp,
        month,
        date,
        year,
        seconds,
        minutes,
        hours;
    
    timestamp = new Date(value);
    month = timestamp.getMonth() + 1;
    date = timestamp.getDate();
    year = timestamp.getFullYear();
    seconds = timestamp.getSeconds();
    minutes = timestamp.getMinutes();
    hour = timestamp.getHours();

    return chunk.write(hour + ':' + minutes + ':' + seconds);
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
app.get('/employee/:id/punch/:type', routes.employee.punch);
app.post('/employee/:id/punch', routes.employee.punch);
app.get('/employee/:id/report', routes.employee.report);
app.get('/employee/:id/reportdetails', routes.employee.reportDetails);

app.listen(app.get('port'));

//NEXT IS MODEL
//MODEL DB
//CRUD
