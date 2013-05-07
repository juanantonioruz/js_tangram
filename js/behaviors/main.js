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

    var event_data={
        current_context:semantic_context,
        event_history:[]
    };

    event_data.get_semantic_dom=event_data.current_context.semantic_dom;
    event_data.semantic_event=event_data.current_context.semantic_events.show_history;


    // AOP manipulation, adding onStart behaviors more behaviors
    //TODO: it must be done in any place in code, currently only works before compose_behaviors invocation Behavior 
    BS.show_history.on_start.push(BS.template_history);


 

    // it is usually an ui update, so inside we can use jquery and semantic_dom
    var onSuccessCallback=function(event){$(semantic_dom.footer.status).html("end all behaviors! ").css('background-color', 'yellow').fadeOut(1000);};
    var onErrorCallback=function(e){alert("error"+toJson(e));};

// response to event_data
    compose.response_to_event(event_data, 
                      onSuccessCallback,
                      onErrorCallback);



});
