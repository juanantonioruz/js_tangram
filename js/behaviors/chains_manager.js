define(
    ["js/behaviors/compose_async.js",
     "js/behaviors/contexts_service.js",
     "js/behaviors/behaviors_service.js",
     "js/behaviors/welcome_context.js"
    
    ], 
    function(compose, 
             getEventInContextService, BS, welcome_context) {


        //AOP in any code place and in any runtime time
        // the ideal would be defined in json style in corresponding context 

        // so far we have only one context... at medium term it will change to access a context factory map
       
        welcome_context.apply( "show_history.template_history",  "ON_START", "show_history.show_user_history");
        welcome_context.apply( "show_history.attach_behaviors",  "ON_END", "show_history.show_user_history");


        var onSuccessCallback=function(eventFinishChain){
            var diff=eventFinishChain.recordDiff();
            highlightStatus("all steps in pipeline are done! in "+diff +" ms");
        };
        var onErrorCallback=function(e){
            highlightStatus("error"+toJson(e));
        };
        
        
        // create and start  pipeline function TODO: FROM HERE:  but doesn't invoke yet to let include the listeners
        function start_pipeline(current_pipeline_event, semantic_context, semantic_event_ns, onSuccessCallback, onErrorCallback ){

            var pipeline_event=getEventInContextService(current_pipeline_event, semantic_context, semantic_event_ns);
            pipeline_event.semantic_event.behaviors_instances=pipeline_event.semantic_event.behaviors_array.map(BS);
            compose.response_to_event(pipeline_event, 
                                      onSuccessCallback,
                                      onErrorCallback);
        };

        return {
            show_history: function (){
                start_pipeline(null,  welcome_context, 'show_history', onSuccessCallback, onErrorCallback);         
            }
            , start: function(){
                start_pipeline(null,  welcome_context, 'start', onSuccessCallback, onErrorCallback);
            }};

    });

