define(["js/async.js"], function(async) {
    
    var dispatcher=(function(){
        var domain_tree={};
        var filters=[];

       
        return {
            dispatch:function(transformation_event_type, target, data_state,callback){


                var Pipeline=this.Pipeline;
                
                var that=this;

                 if(filters.length>0 ){

                //TODO filters have to be an array not only one... reverse!!!

                     var composition=async.compose.apply(null, filters.map(function(o){return o.bind({data_state:data_state, target:target, transformation_event_type:transformation_event_type});}));
                     composition(data_state, function(err, result){
                         //TODO error catching?? !
                             continue_listeners();              
                     });
                 }else{
                     continue_listeners();              
                 }
                // //     if(!pipeline_listeners) pipeline_listeners=[];
                // //     var ff=filters.map(function(o){return {parallel:false, pipeline:o};});

                // //     ff.map(function(o){ pipeline_listeners.push(o);});


                
                function continue_listeners(){
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

                            var compose=  new Pipeline("pipeline_compose!")
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
                };
                


                





            },
            
            listen:function(transformation_event_type, ns_listened,  pipeline, parallel_or_sync ){
                var actual_listeners=domain_tree[ns_listened+"/"+transformation_event_type];
                if (actual_listeners) {
                    actual_listeners.push({pipeline:pipeline, parallel:parallel_or_sync}) ;
                }else{ 
                    domain_tree[ns_listened+"/"+transformation_event_type]=[{pipeline:pipeline, parallel:parallel_or_sync}];
                }
                
            },
            filter:function(_fn){
                filters.push(_fn);
            },

            reset:function(){
                domain_tree={};
            }
            
        };

    })();
    return dispatcher;

});
