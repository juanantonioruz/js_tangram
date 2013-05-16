define(["js/fiber.min.js","js/pipelines/state_step_type.js","js/async.js"],
        function(Fiber, StateStep,async) {
            

            var Pipeline=Fiber.extend(function(){
                return  {
                    init: function(name) {
                        this.ns=name;
                        this.future_state_steps=[];
                        return this;
                    },
                    addTransformation:function(ns, transformation_fn){
                        this.future_state_steps.push(new StateStep(ns, transformation_fn));
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
                        $('#status').fadeOut();
                        this.after_data_state=$.extend(true, {}, data_state);
                    },
                    on_init:function(data_state){
                        $('#status').fadeIn();
                        this.before_data_state=$.extend(true, {}, data_state);
                    },
                    transform:function(data_state, on_success, on_error){
                        var that=this;
                        // this function composition use the method transform of each statestep in the context of each step (bind) ... the funcions for composing have to be rearranged in reverse order
                        var composition=async.compose.apply(null, this.future_state_steps.reverse().map(function(o){return o.transform.bind(o);}));


                        this.on_init(data_state);

                        composition($.extend(true, {}, data_state),function(err, res){

                            if(!err){
                                that.on_end(res);
                                on_success(res, that);
                            }else{
                                on_error(err, that);
                            }

                        });





                        
                    }
                };
            });

            return Pipeline;
            
});
