var http = require('http');
// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World\n');
// }).listen(1337, '127.0.0.1');


var fs = require("fs");
var exp = require("express");
var __dirname=".";
var app = exp();
var sys = require('util'),
    rest = require('restler');

function toJson(o){
    return JSON.stringify(o, null, 4);
};

app.use('/js', exp.static(__dirname + '/js'));
app.use('/styles', exp.static(__dirname + '/styles'));
app.use('/images', exp.directory(__dirname + '/public/images'));


// app.use('/js', express.static("./js/require.js"));


app.get('/', function(req, res) {
    fs.readFile(__dirname + '/index.html', 'utf8', function(err, text){
        res.send(text);
    });
});

app.get('/tenants', function(req, res){

    rest.get('http://192.168.1.22:35357/v2.0/tenants', {headers:{ "X-Auth-Token": "tokentoken" }}).on('complete', function(result) {
        if (result instanceof Error) {
            sys.puts('Error: ' + result.message);
            res.send('Error: ' + result.message);
            //            this.retry(5000); // try again after 5 sec
        } else {
            res.send(result);
            sys.puts(toJson(result));
        }
    });


    // $.ajax({
    //     type: "GET",
    //     url: "http://192.168.1.22:35357/v2.0/tenants",
    //     headers: { "X-Auth-Token": "tokentoken" }
    // }).done(function( msg ) {
    //     res.send("hola!");
    //     // alert( "Data recieved: " + msg );
    //     // callback(null, data_state);
    // });

});

app.listen(3000);

console.log('Server running at http://127.0.0.1:3000/');
