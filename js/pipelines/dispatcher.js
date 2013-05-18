define(function() {
    
    var dispatcher=(function(){
        var domain_tree={};
        function contains(context, search){
            return (context.indexOf(search) !== -1);
        }
        return {
            dispatch:function(transformation_event_type, target, data_state,callback){

                if(transformation_event_type=="ON_INIT"){
                    
                    $('#proposal').append("<h2>"+target.ns+"</h2>");

                }



                if(transformation_event_type=="ON_END"){
                    
                    $('#proposal').append("<span>ENDING: "+target.ns+" :::::::: Time Elapsed: "+target.diff+"</span><br>");

                }


       //         console.log("try to dispatch: "+transformation_event_type+" "+target.ns);
                var history_message=transformation_event_type+"/"+target.ns+((transformation_event_type=="ON_END")? " finished in "+data_state.diff+"ms":" ... timing ..." );
                //   data_state.history.push(history_message);
                   //data_state.user_history.push(" on_end pipeline: "+this.ns+" in: "+this.diff+" ms" );
                if(transformation_event_type=="ON_END" || transformation_event_type=="ON_INIT"){
                    if(contains(history_message, "state_step_"))
                        history_message=" -------- "+history_message;
                  $('#right').fadeIn(function(){$('#history_status').append("<li>"+history_message.replace("ON_", "")+"</li>");
});
                }




                var pipeline_listeners=domain_tree[target.ns+"/"+transformation_event_type];
                if(pipeline_listeners){
                    console.log(target.ns+"/"+transformation_event_type+":: listeners size: "+pipeline_listeners.length);

                    pipeline_listeners.map(function(o){
                        if(o.parallel){
                            o.pipeline.apply_transformations(data_state);
                            callback();
                        }else{
                            //console.log("chained in runtime synchronous");
                            var actual=o.pipeline.on_success;
                            var changed=function(res, pipeline){
                                actual(res,pipeline);
                                callback();
                            };
                            o.pipeline.on_success=changed;
                            o.pipeline.apply_transformations(data_state);
                        }
                    });
                }else{
                    callback();
                }
            },
           
            listen:function(transformation_event_type, ns_listened,  pipeline, parallel_or_sync ){
                var actual_listeners=domain_tree[ns_listened+"/"+transformation_event_type];
                if (actual_listeners) {
                    actual_listeners.push({pipeline:pipeline, parallel:parallel_or_sync}) ;
                }else{ 
                    domain_tree[ns_listened+"/"+transformation_event_type]=[{pipeline:pipeline, parallel:parallel_or_sync}];
                }
                
            }
        };
    })();
    return dispatcher;

});
