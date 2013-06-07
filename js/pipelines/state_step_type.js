define(["js/fiber.min.js","js/pipelines/dispatcher.js"],
       function(Fiber, dispatcher) {
           

           var StateStep=Fiber.extend(function(){
               return  {
                   init: function(name, _fn) {
                       this.ns="state_step_"+name;
                       this.transform_fn=_fn;
                   },

                   on_end:function(data_state, callback){
                       this.after_data_state=$.extend(true, {}, data_state);
                       recordDiff(this);
                       recordDiff(this.after_data_state);
                       recordDiff(data_state);

                       this.pipeline.step_count++;
                       this.pipeline.steps_done.push({ns:this.ns, data_transformation:this.after_data_state});
                       dispatcher.dispatch("ON_END",this,  data_state, callback);
                   },

                   on_init:function(data_state, callback){
                       
               //        console.log("this.name: "+this.ns+" pipeline: "+this.pipeline.ns+" step_count: "+this.pipeline.step_count  );
                       this.before_data_state=$.extend(true, {}, data_state);
                       data_state[this.ns]={demo:{}};
                       recordStart(this);
                       recordStart(data_state);
                       recordStart(this.before_data_state);

                       dispatcher.dispatch("ON_INIT",this,  data_state, callback);
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

           return StateStep;
       });
