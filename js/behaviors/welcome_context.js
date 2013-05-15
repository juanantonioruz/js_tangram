define([ "js/behaviors/transformations_service.js","js/async.js"], function(TS, async) {

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
        footer_down:"#footer", 
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


                // there is now an alias  function in pipeline_event to get the context_pipeline_ns
                // TODO change for pipeline_context_ns
                var context=event_data.current_context.ns;
                var pipeline=event_data.semantic_event.ns;
                var domain_behavior=context+"."+pipeline+"."+ns_behavior;
                var message=behavior_event_type+":::"+domain_behavior;

              //  if(behavior_event_type=="START_CHAIN")
                    

                if(behavior_event_type=="ON_START")
                    event_data.addStep(ns_behavior);
                if(behavior_event_type=="ON_END"){
                    // in this line we can record a behavior's history
                    // could be done in aop style 
                     event_data.behavior_history.push(ns_behavior);
                 
                    var diff=event_data.recordEndStep(ns_behavior);
                    message+=" in "+diff+" ms";
                }

                console.log("dispatch:: "+message);
                messageToLogging(message);
//                console.dir(event_data);


                var pipeline_listeners=domain_tree[domain_behavior+"/"+behavior_event_type];
                if(pipeline_listeners){
                    pipeline_listeners.map(function(pipeline_string_id){
                        var actual_key_working=pipeline_string_id.split(".").pop();
                        console.log("trying to dispath event to chain"+actual_key_working);
                     //   console.dir(TS(actual_key_working));
                        //TODO:  that's horrible!
                        var the_f=TS(actual_key_working).process.bind(TS(actual_key_working));
                        async.compose(the_f)(event_data, 
                                                                      function(err, result){
                                                                          console.dir(result);
                                                                      });
//                        TS(actual_key_working).process(event_data);
//                      TODO: ?????? AND how to continue with an event that has ???    pipeline();
                        // init pipeline...related with compose 
                    });
                    
                }
                

            },
            listen:function(pipeline_listener_string_id, behavior_event_type,domain_behavior){
                domain_behavior=semantic_context.ns+"."+domain_behavior;
                console.log("listen::: "+domain_behavior+"/"+behavior_event_type);
                
                var actual_listeners=domain_tree[domain_behavior+"/"+behavior_event_type];
                if (actual_listeners) {
                    actual_listeners.push(pipeline_listener_string_id) ;
                   
                }else{ 
                    domain_tree[domain_behavior+"/"+behavior_event_type]=[pipeline_listener_string_id];
                }
              //  console.log(toJson(domain_tree));
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
                "show_history"],

            back_ui_behaviors_array:[
                "template_history",
                "attach_behaviors"]

        },
        start:{
            ns:"start",
            behaviors_array:[
                "activate_start_chain_button"
                ],
             back_ui_behaviors_array:[]
        },
        start_bis:{
            ns:"start_bis",
            behaviors_array:[
               "load_userDashBoard"
                 ,"display_userDashBoard" 
                 ,"show_history_footer_navigator"
               // , "activate_header_search_form_and_profile_and_login_links"
                ],
            back_ui_behaviors_array:[
                "select_datasource_api_call",
                "select_body_viewer", 
                "attach_behaviors_to_history_footer_navigator"
            ]
        }

    };



        // the context have a semantic_dom_tree property
    var semantic_context={
        ns:"welcome",
        semantic_dom:semantic_dom, 
        semantic_events:semantic_events,
        //alias
        apply:semantic_dom.dispatcher.listen
    };


    semantic_context.apply( "start_bis.select_datasource_api_call",  "ON_START", "start_bis.load_userDashBoard");
    semantic_context.apply( "start_bis.select_body_viewer",  "ON_START", "start_bis.display_userDashBoard");
    semantic_context.apply( "start.activate_start_chain_button",  "ON_END", "start_bis.show_history_footer_navigator");
   
    return semantic_context;
});


