define(["js/fiber.min.js","js/pipelines/pipeline_type.js","js/pipelines/state_step_type.js","js/async.js","js/pipelines/dispatcher.js"],
       function( Fiber, Pipeline, StateStep,async, dispatcher) {
           var contador=0;
           var Mapper_Pipeline=Pipeline.extend(function(base){
               return  {
                   init: function(name, map, model_key, on_success, on_error) {
                       base.init("mapper_"+model_key+"_"+name, on_success,on_error);
                       this.map=map;
                       this.model_key=model_key;
                       return this;
                   },
                   
                   apply_transformations:function(data_state){

                       var pipe=this.map[data_state[this.model_key]];
                       
                       this.addPipe(pipe);
                       
                       base.apply_transformations.call(this, data_state);
                       
                   }

               };
           });

           return Mapper_Pipeline;
           
       });
