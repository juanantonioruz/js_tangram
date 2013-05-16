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

                    on_end:function(data_state){
                        this.after_data_state=$.extend(true, {}, data_state);
                    },
                    on_init:function(data_state){
                        this.before_data_state=$.extend(true, {}, data_state);
                    },
                    
                    transform:function(data_state, callback_chain){
                        var that=this;
                        this.on_init(data_state);
                        function internal_extended_callback(err, results){
                            that.on_end(data_state);
                            callback_chain(err, results);
                        }
                        this.transform_fn(data_state, internal_extended_callback);
                        
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
                }, 1000);
            };

            var chainable2_fn=function(data_state, callback){
                setTimeout(function () {
                    var user_history=[];
                    user_history.push("click here3");
                    user_history.push("click there4");
                    data_state.user_history.push.apply(data_state.user_history, user_history);
                    callback(null, data_state);
                }, 1000);
            };

            var m1=new StateStep("Good_Morning", chainable1_fn);
            var m2=new StateStep("Good_afternoon", chainable2_fn);
            
            
            var future_state_steps=[m1, m2];

            // this function composition use the method transform of each statestep in the context of each step (bind) ... the funcions for composing have to be rearranged in reverse order
            var composition=async.compose.apply(null, future_state_steps.reverse().map(function(o){return o.transform.bind(o);}));
            

            var initial_state_data={user_history:["wake up!"]};

            composition($.extend(true, {}, initial_state_data),function(err, res){

                jqueryIterateAndDisplayHistoryStep("#left", "step1 data state", m1);
                jqueryIterateAndDisplayHistoryStep("#left", "step2 data state", m2);

                jqueryIterateAndDisplay("#center", "Data Before Transformations", initial_state_data.user_history);
                jqueryIterateAndDisplay("#right", "Data After Transformations", res.user_history);

            });


            function jqueryIterateAndDisplay(target_dom_id, title, model){

                $(target_dom_id).append("<h1>"+title+"</h1><ul></ul>");
                $.each(model, function(i, value){
                    $(target_dom_id+' ul').append("<li>"+value+"</li>");
                });
            }

            function jqueryIterateAndDisplayHistoryStep(target_dom_id, title, step){

                $(target_dom_id).append("<ul id='"+step.ns+"'><li><b>"+title+"</b><ul><li>Data State Step Before<ul></ul></li><li>Data State Step After<ul></ul></li></ul></li></ul>");
                $.each(step.before_data_state.user_history, function(i, value){
                    $("#"+step.ns).find('li ul li ul').first().append("<li>"+value+"</li>");
                });
                $.each(step.after_data_state.user_history, function(i, value){
                    $("#"+step.ns).find('li ul li ul').last().append("<li>"+value+"</li>");
                });

            }


        });
