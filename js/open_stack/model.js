define(["js/common.js", "js/pipelines/dispatcher.js", "js/open_stack/model/tenant.js", "js/open_stack/model/token.js","js/open_stack/model/endpoint.js","js/open_stack/model/operation.js"],
       function(common, dispatcher, tenant_model, token_model, endpoint_model, operation_model) {

           function get_store_model(data_model){
               return function (data_state, callback){

                   var dao_result=data_state.dao.result;
                   if(dao_result){
                       var container=data_model.instanciate_container(data_state);

                       data_model.populate_container(data_state, dao_result);
//                       console.dir(data_model.get_model(data_state));
                       $('#content').prepend( "<h2>"+data_model.name+" Loaded</h2><pre><code class='json'>"+common.toJson(data_model.get_model(data_state))+"</code></pre>" );
                       callback(null, data_state);
                   } else{
                       $('#content').prepend( "<h2>Error while "+data_model.name+" Loaded</h2><pre><code class='json'>"+common.toJson(data_state.dao.error)+"</code></pre>" );
                       callback(data_state.dao.error, data_state);
                   }
               };
           };

           var result= {

               store_token_id:get_store_model(token_model),
               store_endpoints:get_store_model(endpoint_model),
               store_tenants:get_store_model(tenant_model),
               store_operation:function(data_state, callback){
                   if(data_state.dao.result){
                   var data_operation=data_state.data_operation;
                   var msg=data_state.dao.result;
                   data_state[data_operation.title]=msg;
                   callback(null, data_state);
                   }else{
                       callback(data_state.dao.error, data_state);
                   }

               }


           };

           return common.naming_fns(result, "model_");







       });
