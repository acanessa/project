var supertest = require("supertest");
var should = require("should");
var assert = require('assert');
var server = supertest.agent("http://localhost:7474");


describe ('Login',function(){
var token = null;
    before(function(done) {
        server
        .post('/login')
        .send({ username: 'acanessa', password: 'XXXXX' })
        .end(function(err, res) {
            token = res.body.token; // Or something
            done();
        });
    });
    
    describe('Token', function() {  
        it('should not be null', function(done) { 
           token.should.not.equal(null);
            done();
        });
    });

    describe('After posting username and password', function() {  
        it('should get a valid token from server', function(done) { 
        server
          .get('/')
          .set('Authorization', token)
          .expect(200, done);
        });
    });
    
    describe ('After getting a token',function(){
        it('should be able to GET request /', function(done) { 
            server
            .get('/')
            .set('Authorization', token)
            .expect(200, done);
        });    
    });    
    
    describe ('Home page',function(){
        it('should return "Hello World!!!!!!!!!!"', function(done) { 
            server
            .get('/')
            .set('Authorization', token)
            .expect('Hello World!!!!!!!!!!', done);
        });    
    });    
    
    
});



 

