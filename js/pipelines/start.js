require.config({
    urlArgs: "bust=" + (new Date()).getTime()
});

this.uiapp={};



require(["js/pipelines/pipeline_type.js", "js/pipelines/helper_display.js"],
        function(Pipeline, display) {

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

            var on_error=function(err){alert(err);};

            var initial_state={user_history:["wake up!"]};
            function start1(){
            new Pipeline("pipeline1")
                    .addTransformation("Good_Morning", transformation_chainable1_fn)
                    .addTransformation("Good_Afternoon", transformation_chainable2_fn)
                    .transform(initial_state, 
                               function(res, pipeline){
                                   on_success(res, pipeline); 
                                   initial_state=res;
                                   $('#start_pipeline').prop("value", "next pipeline!").off('click').click(start2);}, on_error);
        }

            function start2(){
            new Pipeline("pipeline2")
                    .addTransformation("Good_Night", transformation_chainable3_fn)

                    .transform(initial_state, on_success, on_error);
            }
            $('#start_pipeline').click(start1);


});
