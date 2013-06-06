define(["/js/open_stack/loadings.js"], function (loadings) {
    return describe("open_stack_loadings", function() {
        
        function Callback(){
            var contador=0;
            return {
                callback:function(error, data_state){
                    contador++;
                },
                finished: function(){
                    if(contador>0){
                        return true;
                    }else{
                        return false;
                    }
                }
            };
            
        }

        it("the token_id with 'demo' user login must be defined", function() {
            var op=new Callback();
            var example=loadings.tokens;
            var data_state={host:'localhost:3000', user:"demo", password:"password", ip:"192.168.1.22"};
            
            runs(function() {
                example(data_state, op.callback);
            });
            
            waitsFor(function() {
                if(op.finished()){
                    expect(data_state.token_id).toBeDefined();
                    return true;
                }else{
                    return false;
                }
            }, "The token must be setted", 2000);
            
            
            
        });
        

    });


});
