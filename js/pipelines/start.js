require.config({
    urlArgs: "bust=" + (new Date()).getTime()
});


this.uiapp={

    dispatcher:(function(){
        var domain_tree={};
        return {
            dispatch:function(transformation_event_type, ns_target, data_state,callback){
                console.log("try to dispatch: "+transformation_event_type+" "+ns_target);
                var pipeline_listeners=domain_tree[ns_target+"/"+transformation_event_type];
                if(pipeline_listeners){
                    console.log(ns_target+"/"+transformation_event_type+":: listeners size: "+pipeline_listeners.length);

                    pipeline_listeners.map(function(o){
                        if(o.parallel){
                            o.pipeline.apply_transformations(data_state);
                            callback();
                        }else{
                            //console.log("chained in runtime synchronous");
                            var actual=o.pipeline.on_success;
                            var changed=function(res, pipeline){
                                actual(res,pipeline);
                                callback();
                            };
                            o.pipeline.on_success=changed;
                            o.pipeline.apply_transformations(data_state);
                        }
                    });
                }else{
                    callback();
                }
            },
            listen:function(transformation_event_type, ns_listened,  pipeline, parallel_or_sync ){
                var actual_listeners=domain_tree[ns_listened+"/"+transformation_event_type];
                if (actual_listeners) {
                    actual_listeners.push({pipeline:pipeline, parallel:parallel_or_sync}) ;
                }else{ 
                    domain_tree[ns_listened+"/"+transformation_event_type]=[{pipeline:pipeline, parallel:parallel_or_sync}];
                }
                
            }
        };
    })()
};


require(["js/pipelines/pipeline_type.js", "js/pipelines/helper_display.js","js/async.js"],
        function(Pipeline, display, async) {

            var transformation_chainable1_fn=function(data_state, callback){
                setTimeout(function () {
                    var user_history=[];
                    user_history.push("take a shower");
                    user_history.push("have breakfast");
                    data_state.user_history.push.apply(data_state.user_history, user_history);
                    callback(null, data_state);
                }, 250);
            };

            var transformation_chainable2_fn=function(data_state, callback){
                setTimeout(function () {
                    var user_history=[];
                    user_history.push("have lunch");
                    user_history.push("have a nap");
                    data_state.user_history.push.apply(data_state.user_history, user_history);
                    callback(null, data_state);
                }, 250);
            };

            var transformation_chainable3_fn=function(data_state, callback){
                setTimeout(function () {
                    var user_history=[];
                    user_history.push("have dinner");
                    user_history.push("go to bed");
                    data_state.user_history.push.apply(data_state.user_history, user_history);
                    // to throw an error                    callback("that's an error!!", data_state);
                    callback(null, data_state);
                }, 250);
            };
            
            var transformation_chainable4_fn=function(data_state, callback){
                setTimeout(function () {
                    var user_history=[];
                    user_history.push("i am the slowest");
                    data_state.user_history.push.apply(data_state.user_history, user_history);
                    callback(null, data_state);
                }, 2000);
            };


            var on_success=function(res, pipeline){
                
                pipeline.getSteps().map(
                    function(step){
                        display.jqueryIterateAndDisplayHistoryStep("#left", step.ns, step,  "user_history");
                    }
                );
                display.jqueryIterateAndDisplayHistoryStep("#center", pipeline.ns, pipeline, "user_history");

            };

            var on_error=function(err, pipeline){alert(err); };

            var initial_state={user_history:["wake up!"]};

            function getPipeline1(){
                return             new Pipeline("pipeline1")
                    .addTransformation("Good_Morning", transformation_chainable1_fn)
                    .addTransformation("Good_Afternoon", transformation_chainable2_fn);

            }

            function getPipeline2(){
                return  new Pipeline("pipeline2")
                    .addTransformation("Good_Night", transformation_chainable3_fn);

            }

            function getPipelineListen(){
                return  new Pipeline("pipelineListen")
                    .addTransformation("i_am_the_slowest", transformation_chainable4_fn);

            }
            function start1(){
                var  on_success_start1=function(res, pipeline){
                    on_success(res, pipeline); 
                    initial_state=res;
                    $('#start_pipeline').prop("value", "next pipeline!").off('click').click(start2);};
                 var pipe_listener=getPipelineListen().set_on_success(on_success_pipe("successlistenter")).set_on_error(get_alert("error  listener"));
                 window.uiapp.dispatcher.listen("ON_END","pipeline1",  pipe_listener, false);

                var pipeline1=getPipeline1()
                    .set_on_success(on_success_start1)
                    .set_on_error(on_error)
                    .apply_transformations(initial_state);
            }

            function start2(){
                
                getPipeline2().set_on_success(on_success).set_on_error(on_error)
                    .apply_transformations(initial_state);
            }
            function get_alert(message){
                return function(res, pipeline){
                    var extended_message=message+" in pipeline: "+ ((pipeline)? pipeline.ns: "no_pipeline")+"\n"+toJson((res)? res : "no res!");

                    console.log(extended_message);
                    // alert(extended_message);
                };
            }
            var  on_success_pipe=function(message){
                return function(res, pipeline){
                    on_success(res, pipeline); 
                    get_alert(message);
                    
                };};

            function compose_it(){
                




                var pipe_1=getPipeline1().set_on_success(on_success_pipe("success11111")).set_on_error(get_alert("error 1"));
                var pipe_2=getPipeline2().set_on_success(on_success_pipe("success222")).set_on_error(get_alert("error 2"));

                var compose=  new Pipeline("pipeline_compose!")
                        .set_on_success(get_alert("success::: composing"))
                        .set_on_error(get_alert("error on composing"));

                compose.addPipe(pipe_1).addPipe(pipe_2);
                //                    .addPipe(pipe_1).addPipe(pipe_2);
                
                compose.apply_transformations({user_history:["composing history!!"]});
                

            }

            function parallel_event(){


                var pipe_1=getPipeline1().set_on_success(on_success_pipe("success11111")).set_on_error(get_alert("error 1"));
                var pipe_listener=getPipelineListen().set_on_success(on_success_pipe("successlistenter")).set_on_error(get_alert("error  listener"));


                window.uiapp.dispatcher.listen("ON_INIT","pipeline1",  pipe_listener, true);
                pipe_1.apply_transformations({user_history:["vamos async"]});
            };

            function  sync_event(){
                alert("lets go sync");

                var pipe_1=getPipeline1().set_on_success(on_success_pipe("success11111")).set_on_error(get_alert("error 1"));
                var pipe_listener=getPipelineListen().set_on_success(on_success_pipe("successlistenter")).set_on_error(get_alert("error  listener"));


                window.uiapp.dispatcher.listen("ON_INIT","pipeline1",  pipe_listener, false);
                pipe_1.apply_transformations({user_history:["vamos sync"]});
            };

            $('#start_pipeline').click(start1);


            $('#compose_pipelines').click(function(){compose_it();});
            $('#compose_parallel_pipelines_on_init').click(function(){parallel_event();});
            $('#compose_sync_pipelines_on_init').click(function(){sync_event();});
            


        });
