define(["js/fiber.min.js","js/pipelines/pipeline_type.js","js/pipelines/state_step_type.js","js/async.js","js/pipelines/dispatcher.js"],
       function( Fiber, Pipeline, StateStep,async, dispatcher) {
           
           var contador=0;
           var Switcher_Pipeline=Pipeline.extend(function(base){
               return  {
                   // ATTENTION: THIS METHOD CANT BE OVERWRITE
                   // namely call to base.init(...) it's related to identity in object instance
                   init: function(name,function_switch_expression,  model_key, expression ) {
                       //TODO improve this init method maybe delegating to other construct...
                       this.step_count=0;

                       this.future_state_steps=[];
                       this.steps_done=[];

                       this.children=[];
                       // default synchronous behavior
                       this.parallel=false;
                       contador++;

                       this.ns="pipeline_switcher_"+name+"?"+model_key;
                       //TODO: THIS IS THE ERROR FOUND!!      base.init("mapper_"+model_key+"_"+name+"*"+contador, on_success,on_error);
                       this.function_switch_expression=function_switch_expression;
                       this.model_key=model_key;

                       return this;
                   },
                   

                   apply_transformations:function(data_state){


                       
                       var value=data_state.get_value(this.model_key);                      
                       var pipe=this.function_switch_expression(value);


                      


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
           
           return Switcher_Pipeline;
           
       });
