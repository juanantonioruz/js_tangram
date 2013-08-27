var http = require('http');
// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World\n');
// }).listen(1337, '127.0.0.1');




var  base={
        description:"",
        method:"",
        url:"base_url",
        data_to_send:"", 
        data_to_recieve:""
    };


var n=Object.create(base);
n.url=n.url.replace("base", "extending");
console.log("testing prototype......");
console.log(toJson(n.url));
console.log(toJson(base));
console.log("\nend testing prototype\n");

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
app.use('/home/js', exp.static(__dirname + '/js'));
app.use('/spec', exp.static(__dirname + '/spec'));
app.use('/styles', exp.static(__dirname + '/styles'));
app.use('/css', exp.static(__dirname + '/css'));
app.use('/images', exp.directory(__dirname + '/public/images'));
app.use('/pix', exp.static(__dirname + '/pix'));
app.use('/jasmine', exp.static(__dirname + '/jasmine-standalone-1.3.1'));



// app.use('/js', express.static("./js/require.js"));


app.get('/', function(req, res) {
    fs.readFile(__dirname + '/index.html', 'utf8', function(err, text){
        res.send(text);
    });
});

app.get('/home/', function(req, res) {
    fs.readFile(__dirname + '/home/index.html', 'utf8', function(err, text){
        res.send(text);
    });
});

app.get('/child.html', function(req, res) {
    fs.readFile(__dirname + '/child.html', 'utf8', function(err, text){
        res.send(text);
    });
});





app.get('/SpecRunner', function(req, res) {
    fs.readFile(__dirname + '/SpecRunner.html', 'utf8', function(err, text){
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




app.post('/zendesk', function(req, res){

   rest.get('https://'+req.body.ip+'/api/v2/'+req.body.operation+'.json',
            {username: req.body.user,  password:req.body.password }
           )
             .on('complete', function(result) {
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
app.post('/zendesk_create', function(req, res){
sys.puts(req.body.user+":"+req.body.password);
            sys.puts('https://'+req.body.ip+'/api/v2/'+req.body.operation+'.json'+JSON.stringify(req.body.model));
                sys.puts(toJson(req.body.user+"---"+req.body.password));
   rest.postJson('https://'+req.body.ip+'/api/v2/'+req.body.operation+'.json',
             {user:req.body.model.user} , {username: req.body.user,  password:req.body.password}
           )
             .on('complete', function(result) {
sys.puts('COMPLETE: ' + toJson(result));
        if (result instanceof Error) {
            sys.puts('Error: ' + result.message);
            res.send('Error: ' + result.message);
            //            this.retry(5000); // tr∑vy again after 5 sec
        } else {
            res.send(result);
         //   sys.puts(toJson(result));
        }
    });





});

app.post('/tenants', function(req, res){
sys.puts('ip: ' + req.body.s_ip);

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

app.post('/create_server', function(req, res){
    sys.puts(toJson(req.body));
    rest.postJson(req.body.endpoint+'/servers',
            {"server": {"name": req.body.server_name, "flavorRef":req.body.flavorRef, "imageRef":req.body.imageRef,"networks": [{"uuid": req.body.network_id}]}},{headers:{ "X-Auth-Token": req.body.token }} ).on('complete', function(result) {
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
app.post('/create_network', function(req, res){
//{"network":{"name": "sample_network","admin_state_up": false}}
    sys.puts(toJson(req.body));
    rest.postJson(req.body.endpoint+'/v2.0/networks',
            {"network": {"name": req.body.network_name, "admin_state_up":false, "shared":true}},{headers:{ "X-Auth-Token": req.body.token }} ).on('complete', function(result) {
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
app.post('/create_subnet', function(req, res){
//{"subnet":{"network_id":"'$__NETWORK_ID__'","ip_version":4,"cidr":"10.0.3.0/24","allocation_pools":[{"start":"10.0.3.20","end":"10.0.3.150"}]}}
    sys.puts(toJson(req.body));
    rest.postJson(req.body.endpoint+'/v2.0/subnets',
            {"subnet": {"network_id": req.body.network_id, "ip_version":4,"cidr":req.body.cidr, "allocation_pools":[{"start":req.body.start, "end":req.body.end}]}},{headers:{ "X-Auth-Token": req.body.token }} ).on('complete', function(result) {
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




var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});



