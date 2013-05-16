define(["js/fiber.min.js"],
        function(Fiber) {
            

            var StateStep=Fiber.extend(function(){
                return  {
                    init: function(name, _fn) {
                        this.ns=name;
                        this.transform_fn=_fn;
                    },

                    on_end:function(data_state){
                        this.after_data_state=$.extend(true, {}, data_state);
                    },
                    on_init:function(data_state){
                        this.before_data_state=$.extend(true, {}, data_state);
                    },
                    
                    transform:function(data_state, callback_chain){
                        var that=this;
                        this.on_init(data_state);
                        function internal_extended_callback(err, results){
                            that.on_end(data_state);
                            callback_chain(err, results);
                        }
                        this.transform_fn(data_state, internal_extended_callback);
                        
                    }
                };

            });  
            return StateStep;
        });
