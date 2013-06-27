define(["js/async.js"], function(async) {
    var contador=0;    

    var dispatcher=(function(){

        var domain_tree={};
        var filters=[];


        var api= {

            
            dispatch:function(transformation_event_type, target, data_state,callback){
                //                 console.dir(transformation_event_type);


                // this line works because is inyected in start_dev... so TODO: its necesary to change!
                var Pipeline=this.Pipeline;
                
                

                if(filters.length>0){

                    //TODO filters have to be an array not only one... reverse!!!

                    var composition=async.compose.apply(null, 
                                                        filters.map(
                                                            function(o){
                                                                return o.bind(
                                                                    {data_state:data_state, target:target, 
                                                                     transformation_event_type:transformation_event_type});}));
                    composition(data_state, function(err, result){
                        // TODO THIS LINE HAS BEEN MOVED TO MAKE THE FILTERS ASYNC OF THE LISTENERS
                        // this is sync          continue_listeners();       
                    });
                    // this is async
                    continue_listeners();              
                }else{
                    continue_listeners();              
                }
                // //     if(!pipeline_listeners) pipeline_listeners=[];
                // //     var ff=filters.map(function(o){return {parallel:false, pipeline:o};});

                // //     ff.map(function(o){ pipeline_listeners.push(o);});


                
                function continue_listeners(){
                if(transformation_event_type=="ON_END"  || transformation_event_type=="ON_INIT"){
                    callback();
                    return;
                }

                    var searched=target.ns.split("*")[0];
                    var pipeline_listeners;
                    var base=domain_tree[transformation_event_type];
                    if(base){
                        pipeline_listeners=[];
                        if(base.no_ns_listened)
                            pipeline_listeners=pipeline_listeners.concat(base.no_ns_listened);
                        if(base[searched])
                            pipeline_listeners=pipeline_listeners.concat(base[searched]);
                        




                        if (target.class_name=="StateStep"){
                            var   searched_extended=target.pipeline.ns+"|"+searched;
                            var listeners_extended=base[searched_extended];                        
                            if(listeners_extended){
                                pipeline_listeners=pipeline_listeners.concat(listeners_extended);
                            }
                        }
                    }




                    if(pipeline_listeners){


                        
                        //  console.log(target.ns+"/"+transformation_event_type+":: listeners size: "+pipeline_listeners.length);

                        var paralels=pipeline_listeners.filter(function(element, index, array){return (element.parallel)?true:false;});
                        var syncq=pipeline_listeners.filter(function(element, index, array){return (!element.parallel)?true:false;});

                        paralels.map(function(o){
                            //running in parallel
                            // here we can have problems with mutable data_state in async
                            //TODO fix that with the new changes
                            //                             console.dir(bo);
                            var ext=new Pipeline("EVENT.."+transformation_event_type+"");
                            var pipi=o.pipeline();
                            pipi.ns=pipi.ns;
                            // this is not necesary the parallel is related to method apply_transformations call, if it is nested or not
                            //pipi.parallel=true;
                           ext.addTransformation(pipi);
                            ext.apply_transformations(data_state);
                        });


                        if(syncq.length>0){
                            // we have to do a pipeline with this pipelines...
                            // at the end we call the callback
                            contador++;
                            var compose= new Pipeline(transformation_event_type+"/"+target.ns)
                                    .set_on_success(function(res, pipeline){
                                        if(callback)
                                            callback();
                                    })
                                    .set_on_error(function(err, pipeline){alert("TODO: throwing an error: "+toJson(err));});
                            // i have included this to init the pipeline instance.... $.extend(true, {}, o.pipeline) 
                            syncq.map(function(o){
                              //  console.dir(o);
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
            listen_event:function(transformation_event_type, _pipeline, parallel_or_sync){
                if((typeof _pipeline) != "function"){
                    //alert("adapting "+ns_listened+":: ");
                    var _pi=_pipeline;
                   _pipeline=function(){return _pi;};
                }

                api.listen(transformation_event_type, null, _pipeline, parallel_or_sync);
            },
            // dont need to write "pipeline_"
            listen_pipe:function(transformation_event_type, ns_listened,_pipeline, parallel_or_sync){
                if((typeof _pipeline) != "function"){
                    //alert("adapting "+ns_listened+":: ");
                    var _pi=_pipeline;
                   _pipeline=function(){return _pi;};
                }

                api.listen(transformation_event_type, "pipeline_"+ns_listened, _pipeline, parallel_or_sync);
            },
            listen_state_step:function(transformation_event_type, ns_listened,_pipeline, parallel_or_sync){

                if((typeof _pipeline) != "function"){
                    //alert("adapting "+ns_listened+":: ");
                    var _pi=_pipeline;
                   _pipeline=function(){return _pi;};
                }
                api.listen(transformation_event_type, "state_step_"+ns_listened, _pipeline, parallel_or_sync);
            },
            listen_state_step_in_pipe:function(transformation_event_type,  ns_state_step,ns_pipe ,pipeline, parallel_or_sync){
                var ns_listened="pipeline_"+ns_pipe+"|"+"state_step_"+ns_state_step;
                api.listen(transformation_event_type, ns_listened, pipeline, parallel_or_sync);
            },
            
            listen:function(transformation_event_type, ns_listened,  pipeline_or_state_transformation, parallel_or_sync ){
                // alert(instanceof pipeline_or_state_transformation)
                // if(pipeline_or_state_transformation instanceof Function){
                //     alert("it isn't a FUNCTION!");
                   
                //     pipeline_or_state_transformation=function(){return pipeline_or_state_transformation;};
                // }
                //   var actual_listeners=domain_tree[ns_listened+"/"+transformation_event_type];
                var actual_tree=domain_tree[transformation_event_type];
                var actual={pipeline:pipeline_or_state_transformation, parallel:parallel_or_sync};
                if (actual_tree) {
                    if(ns_listened){
                        var a_t_l=actual_tree[ns_listened];
                        if(a_t_l){
                            a_t_l.push(actual);
                        }else{
                            actual_tree[ns_listened]=[actual];
                        }
                    }else{
                        actual_tree.no_ns_listened.push(actual); 
                    }

                }else{ 
                    domain_tree[transformation_event_type]={};
                    domain_tree[transformation_event_type].no_ns_listened=[];
                    if(ns_listened)
                        domain_tree[transformation_event_type][ns_listened]=[actual];
                    else    
                        domain_tree[transformation_event_type].no_ns_listened.push(actual);


                }
            },

            filter:function(_fn){
                filters.unshift(_fn);
            },

            remove:function(transformation_event_type, ns_listened, pipeline){
                

                var actual_listeners=domain_tree[transformation_event_type];
                if(!ns_listened){

                    if (actual_listeners) {
                        if(actual_listeners.no_ns_listened)
                        for(var i=0; i<actual_listeners.no_ns_listened.length; i++){
                            if(actual_listeners.no_ns_listened[i].pipeline.ns==pipeline.ns){
                                actual_listeners.no_ns_listened.splice(i,1);
                            }
                        }
                    }
                }else{
                    if(actual_listeners[ns_listened])
                        for(var i=0; i<actual_listeners[ns_listened].length; i++){
                            if(actual_listeners[ns_listened][i].pipeline.ns==pipeline.ns){
                                actual_listeners[ns_listened].splice(i,1);
                            }
                        }
                }

            },

            reset_filters:function(){
                filters=[];
            },

            reset:function(){
                domain_tree={};
            }

            
        };
        return api;
    })();
    return dispatcher;

});
