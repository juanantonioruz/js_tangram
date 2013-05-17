require.config({
    urlArgs: "bust=" + (new Date()).getTime()
});

define(["js/pipelines/json_data.js", "js/pipelines/dispatcher.js", "js/pipelines/pipeline_type.js", "js/pipelines/helper_display.js","js/async.js"],
        function(json_data, dispatcher, Pipeline, display, async) {

            // console.log(toJson(json_data));

            var transformation_chainable1_fn=function(data_state, callback){
                setTimeout(function () {
                    var user_history=[];
                    user_history.push("take a shower");
                    user_history.push("have breakfast");
                    data_state.history.push.apply(data_state.history, user_history);
                    callback(null, data_state);
                }, 250);
            };

            var transformation_chainable2_fn=function(data_state, callback){
                setTimeout(function () {
                    var user_history=[];
                    user_history.push("have lunch");
                    user_history.push("have a nap");
                    data_state.history.push.apply(data_state.history, user_history);
                    callback(null, data_state);
                }, 250);
            };

            var transformation_chainable3_fn=function(data_state, callback){
                setTimeout(function () {
                    var user_history=[];
                    user_history.push("have dinner");
                    user_history.push("go to bed");
                    data_state.history.push.apply(data_state.history, user_history);
                    // to throw an error                    callback("that's an error!!", data_state);
                    callback(null, data_state);
                }, 250);
            };
            
            var transformation_chainable4_fn=function(data_state, callback){
                setTimeout(function () {
                    var user_history=[];
                    user_history.push("i am the slowest");
                    data_state.history.push.apply(data_state.history, user_history);
                    callback(null, data_state);
                }, 2000);
            };


            var on_success=function(res, pipeline){
                
                pipeline.getSteps().map(
                    function(step){
                        display.jqueryIterateAndDisplayHistoryStep("#left", step.ns, step,  "history");
                    }
                );
                display.jqueryIterateAndDisplayHistoryStep("#center", pipeline.ns, pipeline, "history");

            };

            var on_error=function(err, pipeline){alert(err); };

            var initial_state={history:["wake up!"]};

            function getPipeline1(){
                return  new Pipeline("pipeline1")
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
                 // var pipe_listener=getPipelineListen().set_on_success(on_success_pipe("successlistenter")).set_on_error(get_alert("error  listener"));
                 // dispatcher.listen("ON_END","pipeline1",  pipe_listener, false);

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
                
                compose.apply_transformations({history:["composing history!!"]});
                

            }

            function parallel_event(){

                var pipe_1=getPipeline1().set_on_success(on_success_pipe("success11111")).set_on_error(get_alert("error 1"));
                var pipe_listener=getPipelineListen().set_on_success(on_success_pipe("successlistenter")).set_on_error(get_alert("error  listener"));


                dispatcher.listen("ON_INIT","pipeline1",  pipe_listener, true);
                pipe_1.apply_transformations({history:["vamos async"]});
            };

            function  sync_event(){
                alert("lets go sync");

                var pipe_1=getPipeline1().set_on_success(on_success_pipe("success11111")).set_on_error(get_alert("error 1"));
                var pipe_listener=getPipelineListen().set_on_success(on_success_pipe("successlistenter")).set_on_error(get_alert("error  listener"));


                dispatcher.listen("ON_INIT","pipeline1",  pipe_listener, false);
                pipe_1.apply_transformations({history:["vamos sync"]});
            };

            function init_display(){
                  $('#input_user').append(
                      '<input type="button" id="start_pipeline" value="start pipeline"/><br>'+
                          '<input type="button" id="compose_pipelines" value="run sync pipelines composed in dev time"/><br>'+
                          '<input type="button" id="compose_parallel_pipelines_on_init" value="run async-parallel pipelines composed in runtime on_init event_data"/><br>'+
                          '<input type="button" id="compose_sync_pipelines_on_init" value="run sync pipelines composed in runtime on_init event_data"/><br>');
                
                $('#start_pipeline').click(start1);
            $('#compose_pipelines').click(function(){compose_it();});
            $('#compose_parallel_pipelines_on_init').click(function(){parallel_event();});
            $('#compose_sync_pipelines_on_init').click(function(){sync_event();});

            }

            
            return init_display;

        });
