var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
var request = require('request');
var app = express();
var vars = require(path.join(__dirname, 'varser.js'));
var server = require('http').Server(app);


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var cors = require('cors')
 
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(bodyParser.urlencoded({ extended: false })); 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(express.static(path.join('public')))


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var mongoose = require('mongoose');
mongoose.connect(vars.mon);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected to DB!!!!")// we're connected!
});


var userSchema = new mongoose.Schema({
  name: String,
  time: String,
  timeWanted: Number,
  phone: String
});

var userS = mongoose.model('userS', userSchema);

var carSchema = new mongoose.Schema({
  name: String,
  time: String
});

var carS = mongoose.model('carS', carSchema);

function createUser(namer, timer, timeWantedr, phoner){
  var temp = new userS({
    name: namer,
    time: timer,
    timeWanted: timeWantedr,
    phone: phoner
  });
  temp.save(function (err, temp) {
    if (err) return console.error(err);
    console.log(temp)
  });
}

module.exports.createUser = createUser;

function createCar(namer, timer){
  var temp = new carS({
    name: namer,
    time: timer
  });
  temp.save(function (err, temp) {
    if (err) return console.error(err);
    console.log(temp)
  });
}


module.exports.createCar = createCar;

//createUser("nic",new Date(),12, "5146669999");

function findUsers(){
  userS.find(function (err, users) {
    if (err) return console.error(err);
    console.log(users);
  })
}

function findCars(){
  carS.find(function (err, cars) {
    if (err) return console.error(err);
    console.log(cars);
  })
}

var twilio = require('twilio');
var client = new twilio(vars.first, vars.second);

var spots = 0;

function messageGo(bod, num){
  console.log("starting")
  client.messages.create({
      body: bod,
      to: num, 
      from: vars.fromm
  })
  .then((message) => console.log(message.sid))
  .done();
}

/////API LOGIC

var number = 0;

module.exports.number = number;

function vision(index){
  return new Promise((resolve, reject) => {
    var form = {image: vars.imag + index + ".jpg"};
    form = JSON.stringify(form);
    request({
      headers: {
        "X-Access-Token": vars.token,
        "Content-Type": 'application/json'
      },
      uri: 'https://dev.sighthoundapi.com/v1/recognition?objectType=vehicle',
      body: form,
      method: 'POST'
    }, function (err, res, body) {
      var newbody = JSON.parse(body)
      console.log(newbody.objects)
      console.log();
      if(newbody.objects != undefined){number = newbody.objects.length;}
      console.log(">>>>>>>>>>>><<<<<<<<<<<<<<")
      if (newbody.objects == undefined){
        console.log("no cars detected")
        resolve(0);
      } else {
      console.log("AMOUNT OF CARS DETECTED: " + newbody.objects.length)
      resolve(newbody.objects.length)  
    }
    });
  });
}

module.exports.vision = vision;

//vision();


module.exports = app;