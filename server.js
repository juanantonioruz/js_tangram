var http = require('http');
// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World\n');
// }).listen(1337, '127.0.0.1');


var auth_token_admin="tokentoken";




var fs = require("fs");
var exp = require("express");
var __dirname=".";
var app = exp();
var sys = require('util'),
    rest = require('restler');

function toJson(o){
    return JSON.stringify(o, null, 4);
};
app.use(exp.bodyParser());

app.use('/js', exp.static(__dirname + '/js'));
app.use('/styles', exp.static(__dirname + '/styles'));
app.use('/images', exp.directory(__dirname + '/public/images'));


// app.use('/js', express.static("./js/require.js"));


app.get('/', function(req, res) {
    fs.readFile(__dirname + '/index.html', 'utf8', function(err, text){
        res.send(text);
    });
});

app.post('/tokens', function(req, res){
  // res.send(req.body.s_user+":"+req.body.s_pw);    

   rest.postJson('http://'+req.body.s_ip+':35357/v2.0/tokens',
            {"auth": {"passwordCredentials": {"username":req.body.s_user, "password":req.body.s_pw}}} ).on('complete', function(result) {
        if (result instanceof Error) {
            sys.puts('Error: ' + result.message);
            res.send('Error: ' + result.message);
            //            this.retry(5000); // try again after 5 sec
        } else {
            res.send(result);
    //        sys.puts("NO communication ERROR: "+toJson(result));
        }
    });
});

app.post('/tenants', function(req, res){

    rest.get('http://'+req.body.s_ip+':5000/v2.0/tenants',
             {headers:{ "X-Auth-Token": req.body.token }}).on('complete', function(result) {
        if (result instanceof Error) {
            sys.puts('Error: ' + result.message);
            res.send('Error: ' + result.message);
            //            this.retry(5000); // try again after 5 sec
        } else {
            res.send(result);
         //   sys.puts(toJson(result));
        }
    });
});

app.post('/endpoints', function(req, res){

    rest.postJson('http://'+req.body.s_ip+':35357/v2.0/tokens',
            {"auth": {"passwordCredentials": {"username":req.body.s_user, "password":req.body.s_pw}, "tenantName":req.body.tenant_name}} ).on('complete', function(result) {
        if (result instanceof Error) {
            sys.puts('Error: ' + result.message);
            res.send('Error: ' + result.message);
            //            this.retry(5000); // try again after 5 sec
        } else {
            res.send(result);
          //  sys.puts("NO communication ERROR: "+toJson(result));
        }
    });
});
app.post('/operations', function(req, res){
sys.puts('**************** http://'+req.body.s_host+req.body.s_url);
      rest.get('http://'+req.body.s_host+req.body.s_url,
             {headers:{ "X-Auth-Token": req.body.token }}).on('complete', function(result) {
        if (result instanceof Error) {
            sys.puts('Error: ' + result.message);
            res.send('Error: ' + result.message);
            //            this.retry(5000); // try again after 5 sec
        } else {
            res.send(result);
//            sys.puts(toJson(result));
        }
    });

});

/*
app.get('/tenant/:id', function(req, res){

    rest.get('http://192.168.1.22:35357/v2.0/tenants/'+req.params.id,
             {headers:{ "X-Auth-Token": auth_token_admin }}).on('complete', function(result) {
        if (result instanceof Error) {
            sys.puts('Error: ' + result.message);
            res.send('Error: ' + result.message);
            //            this.retry(5000); // try again after 5 sec
        } else {
            res.send(result);
            sys.puts(toJson(result));
        }
    });
});


app.get('/tokens/:id', function(req, res){

    rest.get('http://192.168.1.22:35357/v2.0/tokens/'+req.params.id,
             {headers:{ "X-Auth-Token": auth_token_admin }}).on('complete', function(result) {
        if (result instanceof Error) {
            sys.puts('Error: ' + result.message);
            res.send('Error: ' + result.message);
            //            this.retry(5000); // try again after 5 sec
        } else {
            res.send(result);
            sys.puts(toJson(result));
        }
    });
});
app.get('/tenant_servers/:id', function(req, res){
    sys.puts("*************"+req.params.id);
    rest.get('http://192.168.1.22:3333/v2.0/'+req.params.id+'/servers',
             {headers:{ "X-Auth-Token": auth_token_admin}}).on('complete', function(result) {
        if (result instanceof Error) {
            sys.puts('Error: ' + result.message);
            res.send('Error: ' + result.message);
            //            this.retry(5000); // try again after 5 sec
        } else {
            res.send(result);
            sys.puts(toJson(result));
        }
    });
});
*/

    // $.ajax({
    //     type: "GET",
    //     url: "http://192.168.1.22:35357/v2.0/tenants",
    //     headers: { "X-Auth-Token": "tokentoken" }
    // }).done(function( msg ) {
    //     res.send("hola!");
    //     // alert( "Data recieved: " + msg );
    //     // callback(null, data_state);
    // });

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});



