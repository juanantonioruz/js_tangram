define(["js/fiber.min.js","js/pipelines/pipeline_type.js","js/pipelines/state_step_type.js","js/async.js","js/pipelines/dispatcher.js"],
       function( Fiber, Pipeline, StateStep,async, dispatcher) {
           

           var Foreach_Pipeline=Pipeline.extend(function(base){
               return  {
                   init: function(name,model_key) {
                       this.model_key=model_key;
                       this.construct("pipeline_"+name);

                       return this;
                   },
                   
                   on_init:function(data_state, callback){

                       var collection=data_state.get_value(this.model_key);

                       //console.dir(collection);
                       data_state.push_current_data(collection[0]);

                        //   console.log("+"+data_state.for_each.length+"____ON_INIT_PIPELINE:/"+this.ns);
                           
                       //console.log(data_state.current_data);


                       // console.dir(data_state.current_data);
                       // console.dir(data_state.for_each);

                       base.on_init.call(this, data_state, callback);

                   },
                   on_end:function(data_state, callback){

                          data_state.pop_current_data();
                        //   console.log("-"+data_state.for_each.length+"____ON_END_PIPELINE:/"+this.ns);



                       base.on_end.call(this, data_state, callback);
                   },
                   apply_transformations:function(data_state){

                       var that=this;
                       var seq=[];
                       var steps= this.future_state_steps ;
                       
                       this.future_state_steps=[];

                       var collection=data_state.get_value(this.model_key);
                    //   console.log(this.model_key+"SIZE:::::::::::::::::::::::::::::::::"+collection.length);
                     for(var i=0; i<collection.length; i++){
                           var pipe=new Pipeline("$.."+i);

                           // TODO: now is cloning to fix the reverse effect in collection
                           pipe.future_state_steps=$.extend(true, [], steps);

                           pipe.set_on_success((function (j){
                               return function(results, pipeline){
                                   if((j)!=collection.length){

                                 //    alert(toJson(data_state['the_model'][i+1]));
                                       var next_current_data=collection[j];

                                       results.set_next_current_data(next_current_data);

                                       //TODO review this code block  cause it seems the runtime flow pass twice
                                       // console.log(j);
//                                        console.dir(results);
                                       }
                               
                               };
                                   
                               })(i+1)
                           );
                           pipe.set_on_error(this.on_error);
                           this.future_state_steps.push(pipe);
                           
                       }
                       // change this line with previous code
//                       data_state.current_data=data_state.get_value(this.model_key)[0];
                       base.apply_transformations.call(this, data_state);
                   
                       
                   }

               };
           });

           return Foreach_Pipeline;
           
       });
