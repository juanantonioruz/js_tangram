define(
    ["js/behaviors/compose_async.js",
     "js/behaviors/contexts_service.js",
     "js/behaviors/behaviors_service.js",
"js/jquery-ui-1.10.3.custom.min.js"
    ], 
    function(compose, 
             getEventInContextService, BS, jQuery) {

        function highlightStatus(message){
             $( "#status" ).css("background-color","yellow").text(message).animate({
                    backgroundColor: "white"
                }, 1000 , function(){$(this).html("").css("background-color", "white");});
        }

            var onSuccessCallback=function(event){
               highlightStatus("all steps in pipeline are done!");
            };
            var onErrorCallback=function(e){
                highlightStatus("error"+toJson(e));
            };
        

    function show_history_fn(){

                var event_show_history=getEventInContextService('wellcome_context', 'show_history');

            // BEGINING AOP ---> this AOP part must be done by BackUI DEV
            // 

            // AOP manipulation, adding onStart behaviors more behaviors
            //TODO: it must be done in any place in code, currently only works before compose_behaviors invocation Behavior 
            // console.log(toJson(BS));




            // ENDING  AOP 
            //---------------------------------------------------------------------------
            
            // on success, it is usually an ui update or the ideal place to toggle an  on_end_process property state


              event_show_history.semantic_event.behaviors_instances=event_show_history.semantic_event.behaviors_array.map(BS);
                  event_show_history.getBehaviorInstance("show_user_history").on_start.push(BS("template_history"));
                event_show_history.getBehaviorInstance("show_user_history").on_end.push(BS("attach_behaviors"));
                //            BS("show_user_history").on_start.push(BS.template_history);
 //            BS("show_user_history").on_end.push(BS.attach_behaviors);
            // response to event_data
            compose.response_to_event(event_show_history, 
                                      onSuccessCallback,
                                      onErrorCallback);

            };

            function start_fn(){
                var event_start=getEventInContextService('wellcome_context', 'start');


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

