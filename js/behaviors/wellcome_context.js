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
            /// ON_START AND ON_END ONLY EVENTS!
            dispatch:function(behavior_event_type, ns_behavior, event_data, callback /*this callback is complex, need more definition still, it must contain the rest of the behavior if is on_Start, but if is on_END then the callback is the same that the behavior had recieved*/){
                

                /*
                 HERE if the developer wants, can open a pipe (start an asynchronously pipe  compose (this is synchronous/secuancial) functions) and
                 at the end of this new pipe call the "callback" argument as on_success callback

                 OR 
                 
                 

                */



                var context=event_data.current_context.ns;
                var pipeline=event_data.semantic_event.ns;

                var message=behavior_event_type+":::"+context+"."+pipeline+"."+ns_behavior;

                if(behavior_event_type=="ON_START")
                    event_data.addStep(ns_behavior);
                if(behavior_event_type=="ON_END"){
                    var diff=event_data.recordEndStep(ns_behavior);
                    message+=" in "+diff+" ms";
                }

                console.log("dispatch:: "+message);
                $.messageToLogging(message);
//                console.dir(event_data);
                
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
        ns:"welcome",
        semantic_dom:semantic_dom, 
        semantic_events:semantic_events};


   
    return semantic_context;
});


