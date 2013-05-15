define(["js/async.js", "./transformations_chain.js", "js/behaviors/transformations_service.js"], function(async, transformations_chain, TS) {
    
    function composeAsyncBehaviors(the_behaviors){
        return  async.compose.apply(null, transformations_chain( the_behaviors.reverse()));
    };

    function response_to_event(pipeline_event, onSuccessCallback, onErrorCallback){

        // from string json declaration in semantic_context search function in BehaviorServiceMap
        var functions_behaviors=pipeline_event.semantic_event.behaviors_array.map(TS);
        
        // using async lib to compose async functions. Internally the async behaviors tree are transformed to a linear array
        var compose_behaviors=composeAsyncBehaviors(functions_behaviors);
        
        //throwing pipeline start/end events
        
        var finishPipelineProcess=function(result){
            console.dir("here we go!");
            var diff=result.recordDiff();
            onSuccessCallback(result);
            result.get_semantic_dom.dispatcher.dispatch("ON_END", "", result);
        };

        compose_behaviors(pipeline_event, function (err, result) {
            if(err) onErrorCallback(err);
            finishPipelineProcess(result);
            if(debug){ console.log("debugging global var debug=true"); console.dir(result);};
            if(fine_debug) console.log("debugging global var fine_debug=true =>\n"+toJson(result));
        });
    };
    return  function(pipeline_event, onSuccessCallback, onErrorCallback){
        response_to_event(pipeline_event, onSuccessCallback,onErrorCallback);
    };
    
}
       

      );
