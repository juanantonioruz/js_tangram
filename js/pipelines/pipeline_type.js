define(["js/fiber.min.js","js/async.js","js/pipelines/dispatcher.js"],
       function( Fiber, async, dispatcher) {
           

           var Pipeline=Fiber.extend(function(){
               var that=this;
               return  {
                   init: function(name,on_success, on_error) {
                     

                       
                       if(on_success)
                       this.on_success=on_success;
                       if(on_error)
                       this.on_error=on_error;
                       this.construct("pipeline_"+name);
                       return this;
                   },
                   construct:function(name){
                       this.ns=name;
                       this.step_count=0;
                       this.future_state_steps=[];
                       this.steps_done=[];
                       this.children=[];
                       // default synchronous behavior
                       this.parallel=false;
           //            console.log("INIT: "+this.ns);
                   },
                   // this method to add statesteps
                   addTransformation:function(state_step){
                       this.future_state_steps.push(state_step);
                       return this;
                   },
                   // this method to add pipes 
                   addPipe:function(pipe){
                       this.future_state_steps.push(pipe);

                       return this;
                   },

                   getStateStep:function(ns){
                       for(var i=0 ; i<this.future_state_steps.length; i++){
                           var internalStateStep= this.future_state_steps[i];
                           if(internalStateStep.ns==ns) return internalStateStep;
                       }
                       throw new Error("doesn't exist an state for this ns: "+ns);
                   },
                   getSteps:function(){
                       // before transformation they are future_state_steps, after it, they are state_steps
                       // the funcions for composing have to be rearranged in reverse order
                       return this.future_state_steps.reverse();
                   },
                   on_init:function(data_state, callback){
                     //  console.log("ON_INIT_PIPELINE:/"+this.ns);
                       dispatcher.dispatch("ON_INIT",this,  data_state, callback);
                   },
                   on_end:function(data_state, callback){
                      // console.log("ON_END_PIPELINE:/"+this.ns);
                       dispatcher.dispatch("ON_END", this, data_state, callback);
                   },
                  
                   //                       .throw_event_on_success(event_name)
                   // i am proposing this tecnique of throwing an event-domain-name on "end" pipe to improve EOP... not always using on_end event, that doesn mean anyting more, and in this case we are inside of an "init" pipeline that doesn't mean nothing niether

                   throw_event_on_success:function(event_name){
                       this.set_on_success(function(results, pipe){ 
                           dispatcher.dispatch(event_name, pipe, results);
                       });
                       return this;
                   },

                   set_on_success:function(fn){
                       // this code is for adding more than one on_success cases
                       if(this.on_success){
                           var temp_os=this.on_success;
                           this.on_success=function(results, pipeline){
                               temp_os(results, pipeline);
                               fn(results, pipeline);
                           };
                       }else    
                       this.on_success=fn;
                       return this;
                   },
                   set_on_error:function(fn){
                       this.on_error=fn;
                       return this;
                   },

                   apply_transformations:function(data_state){

                       var that=this;


                       // this function composition use the method transform of each statestep in the context of each step (bind) ...
                       var composition=async.compose.apply(null, this.getSteps().map(function(o){
                           // this conditional is related to pipelines and statesteps initialization through maps and common.js
                           if((typeof o) == "function") o=o();
                           o.pipeline=that;
                           return o.transform.bind(o);
                       }));


                      

                       function internal_call(){
                           //removed $.extend(true, {}, data_state) usign instead data_state
                           composition(data_state,function(err, res){

                           if(!err){
                               function callback(){
                               that.on_success(res, that);
                               };

                               that.on_end(res, callback);


                           }else{
                       
                               console.log("big one pipeline error: "+that.ns+"\n"+toJson(data_state));

                                   that.on_error(err, that);
                               

                              // this method fails because is using a data  that.on_end(res);
                           }

                       });
                       };
                        this.on_init(data_state, internal_call);

                       
                   },
                   // same api as state step, it is used when we compose  pipelines
                   transform:function(data_state, callback){
                       var that=this;
//                       console.log("try to transform "+this.ns);

                       var actual_on_success=this.on_success;
                       var extended_on_success=function(res, that){
                           actual_on_success(res, that);
                           callback(null, res);
                           //   this.on_success=actual;
                       };
                       this.set_on_success(extended_on_success);

                       var actual_on_error=this.on_error;
                       var extended_on_error=function(err, that){
                           console.log("pipeline error"+that.ns+"\n"+toJson(data_state));
                           actual_on_error(err, that);
                           
                           callback(err, that);
                              this.on_error=actual_on_error;
                       };
                       this.set_on_error(extended_on_error);

                       this.apply_transformations(data_state);



                       // TODO on_error behavior isnt implemented yet!

                   }

               };
           });
           Pipeline.prototype.on_success=   function(results, pipeline){
               //alert("success"+toJson(error));
           };
           Pipeline.prototype.on_error=   function(error, pipeline){
               alert("error"+toJson(error));
           };
           Pipeline.prototype.class_name="Pipeline";
           return Pipeline;
           
       });
