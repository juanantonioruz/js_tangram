require.config({
    urlArgs: "bust=" + (new Date()).getTime()
});

this.uiapp={};



require(["js/pipelines/pipeline_type.js", "js/pipelines/helper_display.js"],
        function(Pipeline, display) {

            var transformation_chainable1_fn=function(data_state, callback){
                setTimeout(function () {
                    var user_history=[];
                    user_history.push("click here1");
                    user_history.push("click there2");
                    data_state.user_history.push.apply(data_state.user_history, user_history);
                    callback(null, data_state);
                }, 1000);
            };

            var transformation_chainable2_fn=function(data_state, callback){
                setTimeout(function () {
                    var user_history=[];
                    user_history.push("click here3");
                    user_history.push("click there4");
                    data_state.user_history.push.apply(data_state.user_history, user_history);
                    callback(null, data_state);
                }, 1000);
            };
            

            var on_success=function(res, pipeline){
                pipeline.getSteps().map(
                    function(step){
                         display.jqueryIterateAndDisplayHistoryStep("#left", step.ns, step,  "user_history");
                    }
                );
                display.jqueryIterateAndDisplayHistoryStep("#center", "pipeline1", pipeline, "user_history");

            };

            var on_error=function(err){alert(err);};


            new Pipeline("start_pipeline")
                    .addTransformation("Good_Morning", transformation_chainable1_fn)
                    .addTransformation("Good_Afternoon", transformation_chainable2_fn)
                    .transform({user_history:["wake up!"]}, on_success, on_error);
        


});
