require.config({
    urlArgs: "bust=" + (new Date()).getTime()
});

this.uiapp={};



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
                    callback(null, data_state);
                }, 250);
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
            function start1(){
                var  on_success_start1=function(res, pipeline){
                    on_success(res, pipeline); 
                    initial_state=res;
                    $('#start_pipeline').prop("value", "next pipeline!").off('click').click(start2);};
                getPipeline1()
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
                    var extended_message=message+"pipeline: "+ ((pipeline)? pipeline.ns: "no_pipeline")+"\n"+toJson((res)? res : "no res!");
//                    alert(extended_message);
                    console.log(extended_message);
                };
            }

            function compose_it(){
                var  on_success_pipe=function(message){
                    return function(res, pipeline){
                        on_success(res, pipeline); 
                       get_alert(message);
                   
                    };};





                var pipe_1=getPipeline1().set_on_success(on_success_pipe("success11111")).set_on_error("error 1");
                var pipe_2=getPipeline2().set_on_success(on_success_pipe("success222")).set_on_error("error 2");

                var compose=  new Pipeline("pipeline_compose!")
                        .set_on_success(get_alert("success::: composing"))
                        .set_on_error(get_alert("error on composing"));
                compose.addPipe(pipe_1).addPipe(pipe_2);
//                    .addPipe(pipe_1).addPipe(pipe_2);
               
                compose.apply_transformations({user_history:["composing history!!"]});
                

            }


            $('#start_pipeline').click(start1);


            $('#compose_pipelines').click(function(){compose_it();});


        });
