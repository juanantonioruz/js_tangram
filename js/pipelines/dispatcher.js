define(function() {
    
    var dispatcher=(function(){
        var domain_tree={};
        return {
            dispatch:function(transformation_event_type, ns_target, data_state,callback){
                console.log("try to dispatch: "+transformation_event_type+" "+ns_target);
                var pipeline_listeners=domain_tree[ns_target+"/"+transformation_event_type];
                if(pipeline_listeners){
                    console.log(ns_target+"/"+transformation_event_type+":: listeners size: "+pipeline_listeners.length);

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
