define(["js/redefines.js","js/fiber.min.js","js/pipelines/pipeline_type.js","js/pipelines/state_step_type.js","js/async.js","js/pipelines/dispatcher.js"],
       function( redefines, Fiber, Pipeline, StateStep,async, dispatcher) {
           

           var Mapper_Pipeline=Pipeline.extend(function(base){
               return  {
                   // ATTENTION: THIS METHOD CANT BE OVERWRITE
                   // namely call to base.init(...) it's related to identity in object instance

                   init: function(name,map, model_key) {
                       //TODO improve this init method maybe delegating to other construct...

                       this.ns="*MAPPER*pipeline_";
                       this.construct(this.ns);
                       //TODO: THIS IS THE ERROR FOUND!!      base.init("mapper_"+model_key+"_"+name+"*"+contador, on_success,on_error);
                       this.map=map;
                       this.model_key=model_key;

                       return this;
                   },
                   

                   apply_transformations:function(data_state){
//                       alert("APPLY "+this.ns);
                       var value=data_state.get_value(this.model_key);
                       var pipe=this.map[value];
                      this.ns+=this.model_key+"_?"+value;


                       // this conditional add flexibility to mapper_pipeline definition, in this case we can use statesteps also besides pipelines
                     //  alert(pipe().class_name);
                       if(pipe.class_name=="StateStep"){
//                           pipe.ns=value;
                           this.addTransformation(pipe);
                       }else if(pipe.class_name=="Pipeline"){    
//                           pipe.ns=value;
                           pipe.ns="pipeline_"+value;
                           this.addPipe(pipe);
                        }else{     
                            var pipe_i=redefines.pipe(pipe);

                           pipe_i.ns="pipeline_"+value;
                           this.addPipe(pipe_i);
                        }
                       
                       base.apply_transformations.call(this, data_state);
                   }

               };
           });
           
           return Mapper_Pipeline;
           
       });
