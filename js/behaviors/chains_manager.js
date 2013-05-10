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

            event_show_history.getBehaviorInstance("show_user_history").on_start.push(BS("template_history"));
            event_show_history.getBehaviorInstance("show_user_history").on_end.push(BS("attach_behaviors"));

            // response to event_data
            compose.response_to_event(event_show_history, 
                                      onSuccessCallback,
                                      onErrorCallback);

        };

        function start_fn(){

            //TODO: NOMENCLATURE::::  the event that causes the init chain can define it!

            var event_start=getEventInContextService(null, 'wellcome_context', 'start');


            // on success, it is usually an ui update or the ideal place to toggle an  on_end_process property state


            event_start.semantic_event.behaviors_instances=event_start.semantic_event.behaviors_array.map(BS);
            
            //event_start.semantic_event.behaviors_array=this.arr;
            // response to event_data
            compose.response_to_event(event_start, 
                                      onSuccessCallback,
                                      onErrorCallback);

        };
        
        return {show_history:show_history_fn, start: start_fn};

    });

