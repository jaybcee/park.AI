var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var client = new twilio("ACc06048dbe0998b58b252e99eed4682a2", "53fe941654e5e0c8bd69464356aa9d0a");
const MessagingResponse = require('twilio').twiml.MessagingResponse;
var big = require('../app.js');
var app = require('express')();
var bodyParser = require('body-parser');
var cors = require('cors')
 
app.use(cors())

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var spots = 0;

function messageGo(bod, num){
  console.log("starting")
  client.messages.create({
      body: bod,
      to: num, 
      from: '+15146137260'
  })
  .then((message) => console.log(message.sid))
  .done();
}

function delayedMessageGo(bod, num, time){
  setTimeout(() => {

    console.log("starting")
    client.messages.create({
        body: bod,
        to: num, 
        from: '+15146137260'
    })
    .then((message) => console.log(message.sid))
    .done();
  }, time);
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendfile('public/index.html');
});

/* GET num page. */
router.get('/num', function(req, res, next) {
  res.send({number:big.number});
});

/*post user page. */
router.post('/user', function(req, res, next) {
  console.log("user route")
  console.log(req.body)
  console.log(req.body.name);  
  big.createUser(req.body.name, new Date(), (parseInt(req.body.time)*1000), req.body.phoneNum);
  //time here is in milliseconds for the purpose of the demo
  var numbero = req.body.phoneNum.split(" ").join("");
  if (numbero == "5146321797" || numbero == "5148823346" || numbero == "5147967305"){
  delayedMessageGo("Your parking is expiring soon! Please make your way to your car, or answer \"add\" followed by the amount of minutes you would like to add to your parking session.", "+1" + numbero , (parseInt(req.body.time)*1000))
  }
res.send(200); 
});

/* GET test page. */
router.post('/test', function(req, res, next) {
  console.log(req.body)
  console.log("past number= " + big.number)
  big.vision(req.body.index).then(function(num){big.number=num});
  res.send({nb:1});
});

router.post('/sms', function(req, res, next) {
  const twiml = new MessagingResponse();
  console.log("got a response")

  var msg = req.body.Body;
  console.log(msg)
  if(msg.split(" ")[0].toUpperCase() == 'ADD' ){
  console.log("res=add")
    if(msg.split(" ").length == 1){
        twiml.message('Please follow "add" with the number of minutes you wish to add.');
        }
        else if(msg.split(" ").length > 1){
          var msgIntoNum = parseInt(msg.split(" ")[1]);
          twiml.message("I'll add " + msgIntoNum + " minutes to your parking session.");
          delayedMessageGo("Your parking extension is going to end, please go to your car or reply with \"add\"", req.body.From, msgIntoNum*1000)
        }


}  else if (msg.split(" ")[0].toUpperCase() == 'AVAILABLE'){
  console.log("res=available")

//INSERT LOGIC HERE TO GET AVAILABLE SPOTS

    if (spots == 1){
    twiml.message('There is ' + spot + ' spot available.');
    }
    else{
     twiml.message('There are ' + spot + ' spots available.');    
    }
} else {
  twiml.message('Sorry, I did not understand your request.');
}
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});



module.exports = router;
