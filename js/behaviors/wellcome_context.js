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
                var domain_behavior=context+"."+pipeline+"."+ns_behavior;
                var message=behavior_event_type+":::"+domain_behavior;

                if(behavior_event_type=="ON_START")
                    event_data.addStep(ns_behavior);
                if(behavior_event_type=="ON_END"){
                    var diff=event_data.recordEndStep(ns_behavior);
                    message+=" in "+diff+" ms";
                }

                console.log("dispatch:: "+message);
                $.messageToLogging(message);
//                console.dir(event_data);


                var pipeline_listeners=domain_tree[domain_behavior+"/"+behavior_event_type];
                 console.log("trying to dispath "+message+" to pipeline_listeners: "+pipeline_listeners);
                if(pipeline_listeners){
                    pipeline_listeners.map(function(pipeline){
                        console.log("trying to dispath event to chain"+pipeline);
//                      TODO: ?????? AND how to continue with an event that has ???    pipeline();
                        // init pipeline...related with compose 
                    });
                    
                }
                

            },
            listen:function(domain_behavior, behavior_event_type, pipeline){
                console.log("listen::: "+domain_behavior+"/"+behavior_event_type);
                var actual_listeners=domain_tree[domain_behavior+"/"+behavior_event_type];
                (actual_listeners) ? actual_listeners.push(pipeline) :  domain_tree[domain_behavior+"/"+behavior_event_type]=[pipeline];
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


