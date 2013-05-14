define(["js/async.js", "./behaviors_chain.js", "js/behaviors/behaviors_service.js"], function(async, behaviors_chain, BS) {
    
    function composeAsyncBehaviors(the_behaviors){
        return  async.compose.apply(null, behaviors_chain( the_behaviors.reverse()));
    };

    function response_to_event(pipeline_event, onSuccessCallback, onErrorCallback){
        // using async lib to compose async functions. Internally the async behaviors tree are transformed to a linear array

        var functions_behaviors=pipeline_event.semantic_event.behaviors_array.map(BS);
        
        var compose_behaviors=composeAsyncBehaviors(functions_behaviors);
        
        compose_behaviors(pipeline_event, function (err, result) {
            if(err) onErrorCallback(err);
            onSuccessCallback(result);
            if(debug){ console.log("debugging global var debug=true"); console.dir(result);};
            if(fine_debug) console.log("debugging global var fine_debug=true =>\n"+toJson(result));
        });
    };
    return  function(pipeline_event, onSuccessCallback, onErrorCallback){
        response_to_event(pipeline_event, onSuccessCallback,onErrorCallback);
    };
    
}
       

      );
