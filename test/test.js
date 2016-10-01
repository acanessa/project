var supertest = require("supertest");
var should = require("should");

// This agent refers to PORT where the program is running.

var server = supertest.agent("http://localhost:7474");

// UNIT test begin

//describe("SAMPLE unit test",function(){
//
//  before(function(done) {
//    server
//      .post('/')
//      .send({ username: 'acanessa', password: 'h2vgvj4dd9!' })
//      .end(function(err, res) {
//        token = res.body.token; // Or something
//        done();
//      });
//  });
//    
//  // #1 should return home page
//  it("should return home page",function(done){
//    // calling home page
//    server
//    .get("/")
//    .expect("Content-type",/text/)
//    .expect(200) // THis is HTTP response
//    .end(function(err,res){
//      // HTTP status should be 200
//      res.status.should.equal(200);
//      done();
//    });
//  });
//
//});


describe('Token auth', function() {

  var token = null;

  before(function(done) {
    server
      .post('/login')
      .send({ username: 'acanessa', password: 'h2vgvj4dd9!' })
      .end(function(err, res) {
        token = res.body.token; // Or something
        done();
      });
  });

  it('should get a valid token from server', function(done) { 
    server
      .get('/')
      .set('Authorization', token)
      .expect(200, done);
  });
});
