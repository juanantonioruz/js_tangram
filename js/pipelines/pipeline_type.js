define(["js/fiber.min.js","js/pipelines/state_step_type.js","js/async.js"],
       function(Fiber, StateStep,async) {
           

           var Pipeline=Fiber.extend(function(){
               return  {
                   init: function(name,on_success, on_error) {
                       this.ns=name;
                       this.future_state_steps=[];
                       this.on_success=on_success;
                       this.on_error=on_error;
                       return this;
                   },
                   // this method to add statesteps
                   addTransformation:function(ns, transformation_fn){
                       this.future_state_steps.push(new StateStep(ns, transformation_fn));
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
                       return this.future_state_steps.reverse();
                   },
                   on_end:function(data_state){
                       recordDiff(this);
                       $('#status').fadeOut();
                       data_state.user_history.push(" on_end pipeline: "+this.ns+" in: "+this.diff+" ms" );
                       this.after_data_state=$.extend(true, {}, data_state);

                   },
                   on_init:function(data_state, callback){
                       this.start=getStart();
                       $('#status').fadeIn();
                       data_state.user_history.push(" on_init pipeline: "+this.ns);
                       this.before_data_state=$.extend(true, {}, data_state);
                      window.uiapp.dispatcher.dispatch("ON_INIT",this.ns,  data_state, callback);
                   },
                   set_on_success:function(fn){
                       this.on_success=fn;
                       return this;
                   },
                   set_on_error:function(fn){
                       this.on_error=fn;
                       return this;
                   },
                   

                   apply_transformations:function(data_state){
                       var that=this;
                       // this function composition use the method transform of each statestep in the context of each step (bind) ... the funcions for composing have to be rearranged in reverse order
                       var composition=async.compose.apply(null, this.future_state_steps.reverse().map(function(o){return o.transform.bind(o);}));


                      

                       function internal_call(){
                           composition($.extend(true, {}, data_state),function(err, res){

                           if(!err){

                               that.on_end(res);
                               that.on_success(res, that);

                           }else{
                               //alert("quillo"+err);
                               console.log("big one pipeline error: "+that.ns+"\n"+toJson(data_state));

                                   that.on_error(err, that);
                               

                              // this method fails because is using a data  that.on_end(res);
                           }

                       });
                       };
                        this.on_init(data_state, internal_call);

                       
                   },
                   // same api as state step, it is used when we compose async pipelines
                   transform:function(data_state, callback){
                       var that=this;
                       console.log("try to transform "+this.ns);

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

           return Pipeline;
           
       });
