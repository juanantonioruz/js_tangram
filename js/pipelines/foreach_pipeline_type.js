define(["js/fiber.min.js","js/pipelines/pipeline_type.js","js/pipelines/state_step_type.js","js/async.js","js/pipelines/dispatcher.js"],
       function( Fiber, Pipeline, StateStep,async, dispatcher) {
           

           var Foreach_Pipeline=Pipeline.extend(function(base){
               return  {
                   init: function(name,model_key) {
                       this.model_key=model_key;
                       this.construct(name);
                       return this;
                   },
                   

                   apply_transformations:function(data_state){

                       var that=this;
                       var seq=[];
                       var steps= this.future_state_steps ;
                       
                       this.future_state_steps=[];

                       var collection=data_state.get_value(this.model_key);
                    //   console.log(this.model_key+"SIZE:::::::::::::::::::::::::::::::::"+collection.length);
                     for(var i=0; i<collection.length; i++){
                           var pipe=new Pipeline(that.ns+"_"+i);
                           // TODO: now is cloning to fix the reverse effect in collection
                           pipe.future_state_steps=$.extend(true, [], steps);
                           pipe.set_on_success((function (i){
                               return function(results, pipeline){
                                   if(i!=collection.length){

                                 //    alert(toJson(data_state['the_model'][i+1]));
                                   results.current_data=collection[i+1];
                                       }
                               
                               };
                                   
                               })(i)
                           );
                           pipe.set_on_error(this.on_error);
                           this.future_state_steps.push(pipe);
                           
                       }
                       data_state.current_data=collection[0];
                       
                       // change this line with previous code
//                       data_state.current_data=data_state.get_value(this.model_key)[0];
                       base.apply_transformations.call(this, data_state);
                   
                       
                   }

               };
           });

           return Foreach_Pipeline;
           
       });
