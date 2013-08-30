define(["js/common.js", "js/pipelines/dispatcher.js"],
       function(common, dispatcher) {
           var result= {
               // need dao={method, action, data}
               // return dao.result || dao.error
               dao:function (data_state, callback){
                   var dao_object=data_state.dao;
                   console.log(common.toJson(dao_object));
                   var that=this;
                   $.ajax({
                       type: dao_object.method,
                       url: dao_object.action,
                       data:dao_object.data
                   })

                       .done(function( msg ) {

                       if(!msg.error ){
                           dao_object.result=msg;
                           if(common.logging.dao.dir)
                               console.log(common.toJson(dao_object));

                           if(that.store_key){
data_state[that.store_key]=dao_object.result;

                               }
                       }else{
                           
                           dao_object.result={error:msg.error};                
                           console.log("error!!");
                          // console.dir(msg.error);

                          // callback(msg.error[dao_object.error_property], data_state);
                       };
                           callback(null, data_state);   
                           
                   });
               },
               show_result:function(data_state, callback){
                   $('#content').prepend( "<h2>DAO  response: </h2><pre><code class='json'>"+common.toJson(data_state.dao.result)+"</code></pre>" );                                  callback(null, data_state);
               }

           };
           return common.naming_fns(result);


       });

