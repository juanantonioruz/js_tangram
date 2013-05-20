define( function() {
    
    var dispatcher=(function(){
        var domain_tree={};
        function contains(context, search){
            return (context.indexOf(search) !== -1);
        }
        return {
            dispatch:function(transformation_event_type, target, data_state,callback){

                if(transformation_event_type=="ON_INIT"){
                    
//                    $('#proposal').append("<h2>"+target.ns+"</h2>");

                }



                if(transformation_event_type=="ON_END"){
                    $('#proposal').append("DONE: <b>"+target.ns+".</b> In Time: "+target.diff+"<br>");                 
                    if(data_state[target.ns])
                    $('#proposal').append("<span>"+toJson(data_state[target.ns].demo.data)+"</span><br><br>");                    


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
                   
                  //  console.log(target.ns+"/"+transformation_event_type+":: listeners size: "+pipeline_listeners.length);

                    var paralels=pipeline_listeners.filter(function(element, index, array){return (element.parallel)?true:false;});
                    var syncq=pipeline_listeners.filter(function(element, index, array){return (!element.parallel)?true:false;});

                    paralels.map(function(o){
                        //running in parallel
                        // here we can have problems with mutable data_state in async

                                o.pipeline.apply_transformations(data_state);
                    });


                    if(syncq.length>0){
                        // we have to do a pipeline with this pipelines...
                        // at the end we call the callback

                        var compose=  new this.Pipeline("pipeline_compose!")
                                .set_on_success(function(res, pipeline){callback();})
                                .set_on_error(function(err, pipeline){alert("TODO: throwing an error: "+toJson(err));});

                        syncq.map(function(o){compose.addPipe(o.pipeline);});
                        compose.apply_transformations(data_state);                        
                        
                    }else{
                        // there is no async pipelines so we continue the execution flow
                        callback();
                    }

                    
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
                
            },
            reset:function(){
                        domain_tree={};
            }
            
        };

    })();
    return dispatcher;

});
