define([ "js/behaviors/behaviors_service.js"], function(BS) {

    // this is an attemp to separate HTML from semantic usability components, (html related components)
    var semantic_dom={
        header:{
            input_user:{
                button:"#start_chain",
                input:"#input_user_input"
            }
        },
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
        },
        start:{
            ns:"start",
            behaviors_array:[
                BS.activate_start_chain_button
                ]
        }

    };


        // the context have a semantic_dom_tree property
    var semantic_context={
        semantic_dom:semantic_dom, 
        semantic_events:semantic_events};


   
    return semantic_context;
});


