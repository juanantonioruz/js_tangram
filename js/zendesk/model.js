define(["js/common.js","js/open_stack/events.js", "js/pipelines/dispatcher.js", "js/open_stack/model/tenant.js","js/open_stack/model/operation.js"],
       function(common, events, dispatcher, tenant_model, operation_model) {
           var result={};
         
           

           result.load_profile=function (data_state, callback){
//               console.dir(data_state.dao.result);
               data_state.profile=data_state.dao.result.users[0];
                   callback(null, data_state);
           };
           


           return common.naming_fns(result, "model_");
       }
      );
