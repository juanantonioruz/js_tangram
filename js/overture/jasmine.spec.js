
function toJson(o){

            return JSON.stringify(o, null, 4);
        }

describe("A suite", function() {
  it("contains spec with an expectation", function() {
    expect(true).toBe(true);
  });
});


jasmine.getEnv().defaultTimeoutInterval = 500;
var request = require('request');

describe("Asynchronous specs", function() {
  var value, flag;

  it("overture_test", function(done) {


  request("http://localhost:3000/overture_test", function(error, response, body){
      console.log("--------------->>>"+JSON.parse(body).success);
      done();
  });  // timeout after 500 ms
    


    
  });
});
