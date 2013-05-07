define(["js/async.js", "./behaviors_chain.js"], function(async, chain) {
    
     function composeAsyncBehaviors(the_behaviors){
        return  async.compose.apply(null, chain( the_behaviors.reverse()));
    };

    return  {
        response_to_event:function (event, onSuccessCallback, onErrorCallback){
        // using async lib to compose async functions. Internally the async behaviors tree are transformed to a linear array
        var compose_behaviors=composeAsyncBehaviors(event.semantic_event.behaviors_array);
        
        compose_behaviors(event, function (err, result) {
            if(err) onErrorCallback(err);
            onSuccessCallback(result);
            if(debug) console.log(toJson(result));
        });
    }
        };
        
    }
);
