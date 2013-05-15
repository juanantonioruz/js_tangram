define(["js/behaviors/compose_async.js",
     "js/behaviors/pipeline_event.js", "js/behaviors/transformations_service.js","js/async.js"], function(start_pipeline, 
             pipeline_event, TS, async) {

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
        left_div:"#left",
        modal:{
            history:{
                history:"#event_history",
                ul:"#event_history div ul"
            }
        }
    };

    semantic_dom.dispatcher=(function(){
        var domain_tree={};
        
        
        return {

            dispatch:function(transformation_event_type, ns_transformation, event_data
                              , callback /*this callback is complex, need more definition still, it must contain the rest of the behavior 
                                          if is on_Start, but if is on_END then the callback is the same that the behavior had recieved*/){
                

                /*
                 HERE if the developer wants, could  open a pipeline (start an asynchronously pipe  compose (this is synchronous/secuancial) functions) and
                 at the end of this new pipe call the "callback" argument as on_success callback

                 OR ....
                */


                // there is now an alias  function in pipeline_event to get the context_pipeline_ns
                // TODO change for pipeline_context_ns
                var context=event_data.current_context.ns;
                var pipeline=event_data.semantic_event.ns;
                var domain_behavior=context+"."+pipeline+((ns_transformation)? "."+ns_transformation : "");
                var message=transformation_event_type+":::"+domain_behavior;

                    

                if(transformation_event_type=="ON_START")
                    event_data.addStep(ns_transformation);
                if(transformation_event_type=="ON_END"){
                    // in this line we can record a behavior's history
                    // could be done in aop style 
                     event_data.behavior_history.push(ns_transformation);
                 
                    var diff=event_data.recordEndStep(ns_transformation);
                    message+=" in "+diff+" ms";
                }

                console.log("dispatch:: >>>>>>>"+message);
                messageToLogging(message);
//                console.dir(event_data);


                var pipeline_listeners=domain_tree[domain_behavior+"/"+transformation_event_type];
                if(pipeline_listeners){
                    pipeline_listeners.map(function(pipeline_string_id){
                        console.log("trying to dispath event to chain::::"+pipeline_string_id);
                        var arra=pipeline_string_id.split(".");

                        if(arra.length==2){
                            console.log("is a transformation event____  "+pipeline_string_id);
                            var actual_key_working=arra.pop();


                        console.log("trying to dispath event to chain__ "+actual_key_working);


                        
                        var the_f=TS(actual_key_working).process.bind(TS(actual_key_working));
                        async.compose(the_f)(event_data, 
                                                                      function(err, result){
                                                                          console.dir(result);
                                                                      });

                        }else{
                            console.log("is a pipeline event____ "+pipeline_string_id);
                            start_pipeline(pipeline_event(null,  event_data.current_context, pipeline_string_id) , function(r){highlightStatus("all steps in second pipeline are done! in "+r.diff +" ms ... of: "+r.pipeline_context_ns); console.log("2 pipelines chained successful");}, function(e){alert("an error has happened!");});         
                        }

                        
                       
                    });
                    
                }
                

            },
            listen:function(pipeline_listener_string_id, transformation_event_type,domain_behavior){
                domain_behavior=semantic_context.ns+"."+domain_behavior;
                console.log("listen::: "+domain_behavior+"/"+transformation_event_type);
                
                var actual_listeners=domain_tree[domain_behavior+"/"+transformation_event_type];
                if (actual_listeners) {
                    actual_listeners.push(pipeline_listener_string_id) ;
                   
                }else{ 
                    domain_tree[domain_behavior+"/"+transformation_event_type]=[pipeline_listener_string_id];
                }
                //console.log(toJson(domain_tree));
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
         advise:{
            ns:"advise",
            behaviors_array:[
                "advise"
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
    semantic_context.apply( "advise",  "ON_END", "start_bis");
   
    return semantic_context;
});


