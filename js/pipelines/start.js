require.config({
    urlArgs: "bust=" + (new Date()).getTime()
});

this.uiapp={};



require(["js/fiber.min.js","js/async.js"],
    function(Fiber, async) {

        
        var StateStep=Fiber.extend(function(){
        return  {
             init: function(name, _fn) {
                 this.ns=name;
                 this.transform_fn=_fn;
             },
            transform:function(data_state, callback_chain){
                this.transform_fn(data_state, callback_chain);
            }
        };

    });  

        var chainable1_fn=function(data_state, callback){
             setTimeout(function () {
                   var user_history=[];
                   user_history.push("click here1");
                   user_history.push("click there2");
                   data_state.user_history.push.apply(data_state.user_history, user_history);
                   callback(null, data_state);
               }, 100);
        };

        var chainable2_fn=function(data_state, callback){
             setTimeout(function () {
                   var user_history=[];
                   user_history.push("click here3");
                   user_history.push("click there4");
                   data_state.user_history.push.apply(data_state.user_history, user_history);
                   callback(null, data_state);
               }, 100);
        };

        var m1=new StateStep("Good Morning", chainable1_fn);
        var m2=new StateStep("Good afternoon", chainable2_fn);
        
        

        var composition=async.compose(m1.transform.bind(m1), m2.transform.bind(m2));
        composition({user_history:["wake up!"]},function(err, res){alert(toJson(res));});
        //m.transform({user_history:["jeyyyy"]}, function(err, res){alert(toJson(res));});

        $('body').append("<h1>working</h1>");


    });
