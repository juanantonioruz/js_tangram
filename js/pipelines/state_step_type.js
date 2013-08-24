define(["js/fiber.min.js","js/pipelines/dispatcher.js", "js/pipelines/pipeline_type.js"],
       function(Fiber, dispatcher, Pipeline) {
           

           var StateStep=Fiber.extend(function(){
               return  {
                   init: function(name, _fn) {
                       // it will be setted in future applyTransformations function invocation
                       
                       this.pipeline=null;
                       
                       this.ns="state_step_"+name;
                       this.transform_fn=_fn;
                       this.state_step_bind={};
    //                   console.log("INIT: "+this.ns);
                   },
                   bind_value:function(key, value){
                       if(this[key]) alert("overlapping value!! WARNING");
                       this[key]=value;
                   },
                   on_end:function(data_state, callback){
//                       console.log("ON_END:/"+this.ns);
                       this.pipeline.step_count++;
                       this.pipeline.steps_done.push({ns:this.ns, data_transformation:this.after_data_state});
                       dispatcher.dispatch("ON_END",this,  data_state, callback);
                   },

                   on_init:function(data_state, callback){
//                       console.log("ON_INIT:/"+this.ns);
                       dispatcher.dispatch("ON_INIT",this,  data_state, callback);
                   },
                   apply_transformations:function(data_state){
                       var pipe=new Pipeline(this.ns.replace("state_step", "pipeline")).addTransformation(this);
                       pipe.apply_transformations(data_state);
                   },
                   
                   transform:function(data_state, callback_chain){
                       var that=this;

                       function internal_call(){
                           function internal_extended_callback(err, results){
                               var call_back_end= function(){
                                   callback_chain(err, results);
                               };
                               that.on_end(data_state, call_back_end);

                           }
                           that.transform_fn(data_state, internal_extended_callback);
                       };

                       this.on_init(data_state, internal_call);
                   }
               };

           }); 

           StateStep.prototype.contador=0;
           StateStep.prototype.class_name="StateStep";
           return StateStep;
       });
