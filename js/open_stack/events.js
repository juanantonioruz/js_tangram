define(["js/common.js", "js/pipelines/dispatcher.js"],
       function(common, dispatcher) {


           var result= {
               throw_event:function (name){
                   return function(data_state, callback){
                       
                       dispatcher.dispatch(name, this, data_state);
                       callback(null, data_state);
                   };
               }


           };
           
           return result;







       });
