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

    semantic_dom.dispatcher=(function(){
        var domain_tree={};
        // example domain_tree.com.ew.welcome ? has listeners property? ==>if has already listeners
        // example domain_tree.com.ew ? has 'welcome' property? ==> if branch exiss
        
        return {
            dispatch:function(ns_behavior_event_process, event_data){
                console.log("dispatch:: "+ns_behavior_event_process);
                console.dir(event_data);
                //TODO split ns in this form "com.ew.wellcome.init" => ['com']['ew']['welcome']['init']
                // search  in that place of domain_tree data the listeners to send the event
                // forEach listener ... listener.process(event_data); ::: more or less
            },
            listen:function(ns_behavior_event_process, chain_or_step){
                console.log("listen::: "+ns_behavior_event_process);
                //TODO split ns in this form "com.ew.wellcome.init" => ['com']['ew']['welcome']['init']
                // record in that place an 
            }
        };
    })();
    


    // usability events related to the context 
    // each event has his own behavior usability point of view chain 
    var semantic_events={
        show_history:{
            ns:"show_history",
            behaviors_array:[
                "load_history", 
                "show_user_history", 
                "show_history"]
        },
        start:{
            ns:"start",
            behaviors_array:[
                "activate_start_chain_button"
                ]
        }

    };


        // the context have a semantic_dom_tree property
    var semantic_context={
        semantic_dom:semantic_dom, 
        semantic_events:semantic_events};


   
    return semantic_context;
});


