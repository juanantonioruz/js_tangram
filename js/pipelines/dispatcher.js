define(["js/async.js"], function(async) {
        var contador=0;    
    var dispatcher=(function(){
        var domain_tree={};
        var filters=[];


        return {
            dispatch:function(transformation_event_type, target, data_state,callback){
                console.log("event_type"+transformation_event_type+"-"+target.ns);
                

                // this line works because is inyected in start_dev... so TODO: its necesary to change!
                var Pipeline=this.Pipeline;
                


                 if(filters.length>0 ){

                //TODO filters have to be an array not only one... reverse!!!

                     var composition=async.compose.apply(null, 
                                                         filters.map(
                                                             function(o){
                                                                 return o.bind(
                                                                     {data_state:data_state, target:target, 
                                                                      transformation_event_type:transformation_event_type});}));
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

                    
                    var pipeline_listeners=domain_tree[target.ns.split("*")[0]+"/"+transformation_event_type];

                    if(pipeline_listeners){


                        
                        //  console.log(target.ns+"/"+transformation_event_type+":: listeners size: "+pipeline_listeners.length);

                        var paralels=pipeline_listeners.filter(function(element, index, array){return (element.parallel)?true:false;});
                        var syncq=pipeline_listeners.filter(function(element, index, array){return (!element.parallel)?true:false;});
                        
                        paralels.map(function(o){
                            //running in parallel
                            // here we can have problems with mutable data_state in async
                            //TODO fix that with the new changes
                            console.dir(o);
                            var pipi=o.pipeline();
                           pipi.parallel=true;

                            pipi.apply_transformations(data_state);
                        });


                        if(syncq.length>0){
                            // we have to do a pipeline with this pipelines...
                            // at the end we call the callback
                            contador++;
                            var compose= new Pipeline("sync_compose_"+transformation_event_type+"*"+contador)
                                    .set_on_success(function(res, pipeline){
                                        if(callback)
                                        callback();
                                    })
                                    .set_on_error(function(err, pipeline){alert("TODO: throwing an error: "+toJson(err));});
                            // i have included this to init the pipeline instance.... $.extend(true, {}, o.pipeline) 
                            syncq.map(function(o){
                                console.dir(o);
//                                alert("invoking");

                                compose.addPipe(o.pipeline());
                            });
                            
                            compose.apply_transformations(data_state);
                        }else{
                            // there is no async pipelines so we continue the execution flow
                            if(callback)
                            callback();
                        }
                    }else{
                        if(callback)
                        callback();
                    }
                };


            },
            remove:function(transformation_event_type, ns_listened, pipeline){
                   var actual_listeners=domain_tree[ns_listened+"/"+transformation_event_type];

                

                if (actual_listeners) {
                    for(var i=0; i<actual_listeners.length; i++){
                        if(actual_listeners[i].pipeline.ns==pipeline.ns){

                            actual_listeners.splice(i,1);

                        }

                    }
                }else{ 
                    // TODO: the listener doesnt exist yet, so it cant be removed
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
            filter:function(_fn){
                filters.push(_fn);
            },
            reset_filters:function(){
                filters=[];
            },

            reset:function(){
                domain_tree={};
            }

            
        };

    })();
    return dispatcher;

});
