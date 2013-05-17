require.config({
    urlArgs: "bust=" + (new Date()).getTime()
});

require(["js/pipelines/json_data.js", "js/pipelines/dispatcher.js", "js/pipelines/pipeline_type.js", "js/pipelines/helper_display.js","js/async.js"],
        function(json_data, dispatcher, Pipeline, display, async) {
            // console.log(toJson(json_data));

            alert("starting simulation ew");
        

        });
