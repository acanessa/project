/*
var io           = require('socket.io')(http);
var redis        = require('redis');
var mongoose     = require('mongoose');
var promise      = require("bluebird");
var maps         = require('googlemaps');
var uuid         = require('node-uuid');
//var interceptor  = require('express-interceptor');
var path         = require('path');
var redis_client = redis.createClient(6379,'localhost'); //creates a new client
//Schema           = mongoose.Schema;
//var PlaceSchema  = new Schema({},{collection:'place'});
//var Place        = mongoose.model('Place', PlaceSchema);
var python = require('python-shell');
*/
var express      = require('express');
var app          = express();
var http         = require('http').Server(app);
var body_parser  = require('body-parser');
var morgan       = require('morgan');
var jwt          = require('jsonwebtoken');
var promise      = require("bluebird");


app.use(body_parser.urlencoded({extended: true,limit: '50mb'}));
app.use(body_parser.json({limit: '50mb'}));

//app.use('/script', express.static(__dirname + '/script'));

app.use(morgan('dev'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
app.disable('etag');
app.listen(7474,function()                                  {console.log("PROJECT  [Running | 7474]")});



function auth_interceptor(req, res,next){
var url = req.originalUrl;
if (req.method == 'OPTIONS'){
    next();
    return;
}
if (url == '/login'){
    next();
    return;
};
   
   
    
var token = req.headers.authorization;
jwt.verify(token, 'supersecret!',function(error,decoded){
    if(error){
        res.status(403).end("NO NO NO! (invalid token querido!!!)");
    };
    if (decoded){
        next();    
    };    
});
};
app.use(auth_interceptor);







//RUTAS
app.post('/login',function(req,res){
    var username = 'acanessa';
    var password = 'h2vgvj4dd9!';
    var login = function(username,password){
        return new promise(function(resolve,reject){
            if (username == 'acanessa'){
                resolve(1);
            }else{
                reject(0);
            }
            
        })
    };
    var create_token = function (user){
        //console.log(user)
        var secret_key = 'supersecret!';//var secret_key = uuid.v4();
        var claim = {
            iss: 'http://52.24.92.181:7474',
            id:'1',
            username:'acanessa'
        };
        var token = jwt.sign(claim,secret_key,{
            expiresIn: 9000                     
        });
        res.setHeader('Content-Type', 'application/json');    
        res.send(JSON.stringify({token:token}));    
    };
    login(username,password)
    .then(function(user){
        create_token(user)
    })
    .catch(function(error){
        res.setHeader('Content-Type', 'application/json');    
        res.send(JSON.stringify(error)); 
    })
    
    
});


app.get('/',function(req,res){
    res.send("Hello World!!!!!!!!!!");
});

