

/*
var io           = require('socket.io')(http);
var redis        = require('redis');
var mongoose     = require('mongoose');
var promise      = require("bluebird");
var maps         = require('googlemaps');

var jwt          = require('jsonwebtoken');
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




//var publicConfig = {
//  key: 'AIzaSyA22FePfk0HUsAI1mUO8ARjhRAH-jhOCA0',
//  stagger_time:       1000, // for elevationPath
//  encode_polylines:   false,
//  secure:             true
//};
//var maps         = new maps(publicConfig);
//USE
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
app.listen(7474,function()                                  {console.log("SOS  [Running]")});
http.listen(3000, function()                                {console.log('SOCKET.IO    [Running]');});
///mongoose.connect('mongodb://localhost:27017/demo',function() {console.log('MONGO  [Connected]');});
//redis_client.on('connect', function()                       {console.log('REDIS  [Connected]');});
//redis_client.debug_mode = false;
//Schema           = mongoose.Schema;
//var PlaceSchema  = new Schema({},{collection:'place'});
//var Place        = mongoose.model('Place', PlaceSchema);    
//var UserSchema  = new Schema({},{collection:'user'});
//var User        = mongoose.model('User', UserSchema);        
    

//var shell = new python('qr.py', {mode: 'text'});
////var shell = python.run('qr.py', {mode: 'text'});
//shell.send('iVBORw0KGgoAAAANSUhEUgAAAMYAAADGAgMAAAD09RfOAAAADFBMVEX///8AAAD///8AAAAIKWj8AAABSUlEQVR4nO2XO47GMAiEaXK/NNz/KqssZhgc76P5KwZFEbH5UozAYDOZ7PPmsNvsWs7j2/O5BwgxY+d53CNyx+3szERqK1RNB59vVghWls6kqpBfkJWTXWoh/6poz1r+K3IiQr3g/FCAkINRp/ghYjrCekYeNjZjts/RyPdx5zmzYTdE5l9xJk9Hspzb2EZh/BaytiApW7IRZiakzHkgsfKX+EI2JD83tbF46B2TERRvpmINvYGg0m8hXefL23GHP0BnISSy4dy7++JJ9uGIYyDBJdTpTRUNG44gvmLuiixnq/3BCMq24dxeadwVEmHIRigZbi0idYV0Q2uoA3C7IAghGauccS/Ibtv6iBB2cBfoJbxJLQS7qF+jJltFLeSFGFVxLWauCjmIzEccXT+3XSFvx2kgaeehkN4skIexXjpfPS1nIzLZJ+0LTqoL8IjhHsMAAAAASUVORK5CYII=');
////shell.send('hello');
//
//shell.on('message', function (message) {
//    console.log(message)        
//});
//shell.end(function (err) {
//  if (err) throw err;
//  console.log('finished');
//});



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
//console.log('TOKEN:',token);
jwt.verify(token, 'supersecret!',function(error,decoded){
    if(error){
        //console.log('ERROR:',error)
        res.status(403).end("NO NO NO! (invalid token querido)");
       // next()
    };
    if (decoded){
        next();    
    };    
});
};
app.use(auth_interceptor);









//INCLUDES
//require('./socket.js')(io)
//require('./redis.js')
//ROUTES
//require('./route/place.js')(app,promise,redis_client,jwt);
//require('./route/migrate.js')(app,promise,redis_client,Place,User);



//RUTAS
app.post('/login',function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    
    var login = function(username,password){
        return new promise(function(resolve,reject){
            redis_client.hgetall('user:'+username, function (error,data) {
                if (data){
                    var user = JSON.parse(JSON.stringify(data));
                    if (user.password == password){
                        resolve(user);
                    }else{
                    reject('PASSWORD_INVALID');    
                    };
                }else{
                    reject('USER_INVALID');
                }

            }); 
        })
    };
    
    login(username,password)
    .then(function(user){
        create_token(user)
    })
    .catch(function(error){
        console.log(error)
        console.log('fuck')
        res.setHeader('Content-Type', 'application/json');    
        res.send(JSON.stringify(error)); 
    })
    
            
        
    
    var create_token = function (user){
        //console.log(user)
        var secret_key = 'supersecret!';//var secret_key = uuid.v4();
        var claim = {
            iss: 'http://52.24.92.181:7474',
            id:user.id,
            username:user.username    
        };
        var token = jwt.sign(claim,secret_key,{
            expiresIn: 9000                     
        });
        res.setHeader('Content-Type', 'application/json');    
        res.send(JSON.stringify(token));    
    };    
    
    
    
    
    
    
    
});

//app.get('/realtime', function(req,res){
//   res.sendFile(__dirname + '/geo/realtime.html'); 
//});


//app.get('/map/direction/:origin_lat?/:origin_lon?/:destination_lat?/:destination_lon?', function(req,res){
//    var options = {
//        origin: req.params.origin_lat +','+ req.params.origin_lon,
//        destination: req.params.destination_lat +','+req.params.destination_lon,
//        mode: 'walking',
//        language: 'en'        
//    };
//    maps.directions(options, function(err, result) {
//        if(err){return;}
//        var steps = [];
//        if (result.routes[0] !== undefined){
//            var route = JSON.parse(JSON.stringify(result.routes[0].legs[0].steps)); //error    
//            if(err){console.log(err)}
//            route.forEach(function(step) {
//                var i = step.html_instructions;
//                i = i.replace(/<b>/g,' ');
//                i = i.replace(/<\/b>/g,' ');            
//                i = i.replace('<div style="font-size:0.9em">','| ');
//                i = i.replace('</div>',' ');
//                console.log(JSON.stringify(result.routes[0]))
//                steps.push({instruction:i,distance:step.distance.text})
//            });
//        
//        res.setHeader('Content-Type', 'application/json');    
//        res.send(JSON.stringify(steps,null,3));    
//        }else{
//        res.setHeader('Content-Type', 'application/json');    
//        res.send(JSON.stringify('No route. Try again.',null,3));                
//        }
//        
//        
//        
//        //console.log(JSON.stringify(route,null,3));    
//
//    });
//        
//
//});
//
//
//
//app.get('/map/distance/:origin_lat?/:origin_lon?/:destination_lat?/:destination_lon?', function(req,res){
//var options = {
//    origins: req.params.origin_lat +','+ req.params.origin_lon,
//    destinations: req.params.destination_lat +','+req.params.destination_lon,
//    mode: 'walking'
//};
//
//maps.distance(options, function(err, result) {
//    
//    if (result.rows[0].elements[0].distance){ //bug
//        var data = JSON.parse(JSON.stringify(result))
//        var distance = data.rows[0].elements[0].distance.text
//        var duration = data.rows[0].elements[0].duration.text
//        var teta = {'distance':distance,'duration':duration}
//        
//        res.setHeader('Content-Type', 'application/json');
//        res.send(JSON.stringify(teta,null,2));        
//    }else{
//        res.setHeader('Content-Type', 'application/json');
//        res.send(JSON.stringify('Not able to get distance. try again.',null,2));        
//    }
//    
//});
//
//});
//
//app.get('/map/geocode/:origin_lat?/:origin_lon?', function(req,res){
//    var options = {
//            "latlng":        req.params.origin_lat+','+req.params.origin_lon,
//            //"result_type":   "postal_code",
//            "language":      "en",
//            //"location_type": "APPROXIMATE"
//            "location_type": "ROOFTOP"
//        
//    };
//
//    maps.reverseGeocode(options,function(error,data){
//        console.log('data',data);
//        //if (data == undefined){
//        //    res.send([]) 
//        //    return;
//        //}
//        //var data = JSON.parse(JSON.stringify(result))
//        //console.log('geocode',data)
//        //console.log('status',data.status)
//        if (data.status == 'OK'){
//            res.send(JSON.stringify(data.results[0].formatted_address))    
//        }else{
//            res.send(JSON.stringify('GPS failed. Try again please.'))        
//        }
//        //if (data.status == 'ZERO_RESULTS'){
//        //
//        //}
//        
//    })
//
//
//
//});
//
//
//
//var qr_decode = function(qr_code){
//    console.log('QR_DECODE FUNCTION')
//    return new promise(function(resolve,reject){
//        console.log('PROMISE')
//        var shell = new python('qr.py', {mode: 'text'});
//        //console.log(qr_code)
//        shell.send(qr_code)
//        
//        shell.on('message', function (message) {
//            console.log('MESSAGE')
//            //resolve('DUMMY'); 
//            resolve(message); 
//        });
//         //resolve('DUMMY'); 
//        //resolve(message);  
//        shell.end(function (err) {
//          if (err){
//            reject(err) 
//            throw err;
//          } 
//          console.log('FINISHED');
//        });
//    });  
//};   
//
//
//app.post('/qrcode', function(req,res){
//console.log('POST')
//var qr_code = req.body.image;
//
//
//console.log(qr_code)    
//
//qr_decode(qr_code)
//.then(function(decoded){
//    console.log('DECODED:',decoded)
//    res.send(JSON.stringify({decoded:decoded}))
//})
//.catch(function(error){
//    console.log('ERROR:',error)
//    //res.send(JSON.stringify({decoded:decoded}))
//})
////res.end()
//})
//
//
//
//
//
