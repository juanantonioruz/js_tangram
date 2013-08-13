define(["js/common.js", "js/pipelines/dispatcher.js"],
       function(common, dispatcher) {
           var result= {
               // need dao={method, action, data}
               // return dao.result || dao.error
               dao:function (data_state, callback){
                   var dao_object=data_state.dao;
                   
                   $.ajax({
                       type: dao_object.method,
                       url: dao_object.action,
                       data:dao_object.data
                   })

                       .done(function( msg ) {

                       if(!msg.error ){
                           dao_object.result=msg;
                          console.dir(dao_object.result);
                           callback(null, data_state);   
                       }else{
                           dao_object.error=msg.error;                           
                          // console.dir(msg.error);

                           callback(msg.error[dao_object.error_property], data_state);
                       }
                   });
               }
           };
           return common.naming_fns(result);


       });
