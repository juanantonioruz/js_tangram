require.config({
    urlArgs: "bust=" + (new Date()).getTime()
});

require(["js/behaviors/compose_async.js", "js/behaviors/behaviors_service.js","js/jquery-1.9.1.min.js"], function(compose, BS) {
    
    // this is an attemp to separate HTML from semantic usability components, (html related components)
    var semantic_dom={
        header:{},
        content:{
            content:"#content",
            ul:"#content ul"
        },
        footer:{
            status:"#status"                
        },
        modal:{
            history:{
                history:"#event_history",
                ul:"#event_history div ul"
            }
        }
    };

    // usability events related to the context 
    // each event has his own behavior usability point of view chain 
    var semantic_events={
        show_history:{
            ns:"show_history",
            behaviors_array:[
                BS.load_history, 
                BS.show_user_history, 
                BS.show_history]
        }
    };


    // the context have a semantic_dom_tree property
    var semantic_context={
        semantic_dom:semantic_dom, 
        semantic_events:semantic_events};

    var event_show_history={
        current_context:semantic_context,
        behavior_history:[]
    };

    event_show_history.get_semantic_dom=event_show_history.current_context.semantic_dom;
    event_show_history.semantic_event=event_show_history.current_context.semantic_events.show_history;



    // BEGINING AOP ---> this AOP part must be done by BackUI DEV
    // 

    // AOP manipulation, adding onStart behaviors more behaviors
    //TODO: it must be done in any place in code, currently only works before compose_behaviors invocation Behavior 
    BS.show_user_history.on_start.push(BS.template_history);

    BS.show_user_history.on_end.push(BS.attach_behaviors);

    // ENDING  AOP 
    //---------------------------------------------------------------------------

 

    // on success, it is usually an ui update or the ideal place to toggle an  on_end_process property state
    var onSuccessCallback=function(event){$(semantic_dom.footer.status).html("end all behaviors! ").css('background-color', 'yellow').fadeOut(1000);};
    var onErrorCallback=function(e){alert("error"+toJson(e));};

// response to event_data
    compose.response_to_event(event_show_history, 
                      onSuccessCallback,
                      onErrorCallback);



});
