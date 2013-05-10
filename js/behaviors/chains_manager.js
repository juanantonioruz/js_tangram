define(
    ["js/behaviors/compose_async.js",
     "js/behaviors/contexts_service.js",
     "js/behaviors/behaviors_service.js",
     "js/jquery-ui-1.10.3.custom.min.js"
    ], 
    function(compose, 
             getEventInContextService, BS, jQuery) {

        // TOdo get better this helper function
        var highlightStatus=$.highlightStatus=function(message){
            $( "#status" ).css("background-color","yellow").text(message).animate({
                backgroundColor: "white"
            }, 2000 , function(){$(this).html("").css("background-color", "white");});
            $.messageToLogging(message, "Plum", "white");
        };

        var messageToLogging=$.messageToLogging=function(message, color, colorT){
            var index=($("#logging ul li").size())+1;
            $("#logging ul").prepend("<li>"+index+" : "+message+"</li>").find("li").first().css({"background": (color) ? color : 'white', "color" : (colorT) ? colorT : 'Plum'});

        };


        var onSuccessCallback=function(event){

            var diff=event.recordDiff();
            highlightStatus("all steps in pipeline are done! in "+diff +" ms");
        };
        var onErrorCallback=function(e){
            highlightStatus("error"+toJson(e));
        };
        

        function show_history_fn(){

            var event_show_history=getEventInContextService(null, 'wellcome_context', 'show_history');

            event_show_history.semantic_event.behaviors_instances=event_show_history.semantic_event.behaviors_array.map(BS);


            //TODO: this code has to change and be defined through listeners, and onSuccess callback main pipeline chain
            // the ideal would be defined in json style in corresponding context 
            // the type of info necesary is::: event_behavior_ns, behavior_ns, event_type (ON_START/ON_END)

            event_show_history.getBehaviorInstance("show_user_history").on_start.push(BS("template_history"));
            event_show_history.getBehaviorInstance("show_user_history").on_end.push(BS("attach_behaviors"));

            // response to event_data
            compose.response_to_event(event_show_history, 
                                      onSuccessCallback,
                                      onErrorCallback);

        };

        function start_fn(){
            create_pipeline(null,  'wellcome_context', 'start', onSuccessCallback, onErrorCallback);

        };
        
        // create pipeline function TODO: FROM HERE:  but doesn't invoke yet to let include the listeners
        function create_pipeline(current_pipeline_event, semantic_context_ns, semantic_event_ns, onSuccessCallback, onErrorCallback ){

            

            var pipeline_event=getEventInContextService(current_pipeline_event, semantic_context_ns, semantic_event_ns);

            pipeline_event.semantic_event.behaviors_instances=pipeline_event.semantic_event.behaviors_array.map(BS);
            


            compose.response_to_event(pipeline_event, 
                                      onSuccessCallback,
                                      onErrorCallback);



        };

        return {show_history:show_history_fn, start: start_fn};

    });

