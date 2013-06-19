define(["js/fiber.min.js","js/pipelines/pipeline_type.js","js/pipelines/state_step_type.js","js/async.js","js/pipelines/dispatcher.js"],
       function( Fiber, Pipeline, StateStep,async, dispatcher) {
           
           var contador=0;
           var Mapper_Pipeline=Pipeline.extend(function(base){
               return  {
                   // ATTENTION: THIS METHOD CANT BE OVERWRITE
                   // namely call to base.init(...) it's related to identity in object instance
                   init: function(name,map, model_key,on_success, on_error) {
                       //TODO improve this init method maybe delegating to other construct...
                       this.step_count=0;

                       this.future_state_steps=[];
                       this.steps_done=[];
                       if(on_success)
                           this.on_success=on_success;
                       if(on_error)
                           this.on_error=on_error;

                       this.children=[];
                       // default synchronous behavior
                       this.parallel=false;
                       contador++;

                       this.ns="pipeline_mapper_"+name+"_"+model_key+"*"+contador;
                       //TODO: THIS IS THE ERROR FOUND!!      base.init("mapper_"+model_key+"_"+name+"*"+contador, on_success,on_error);
                       this.map=map;
                       this.model_key=model_key;

                       return this;
                   },
                   

                   apply_transformations:function(data_state){
                       var pipe=this.map[data_state[this.model_key]];

                       // this conditional add flexibility to mapper_pipeline definition, in this case we can use statesteps also besides pipelines
                       if(pipe.class_name=="StateStep")
                           this.addTransformation(pipe);
                       else if(pipe.class_name=="Pipeline")    
                           this.addPipe(pipe);
                        else     
                           this.addPipe(pipe());
                       
                       base.apply_transformations.call(this, data_state);
                   }

               };
           });
           
           return Mapper_Pipeline;
           
       });
