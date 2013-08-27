define(["js/common.js","js/open_stack/events.js", "js/pipelines/dispatcher.js", "js/open_stack/model/tenant.js","js/open_stack/model/operation.js"],
       function(common, events, dispatcher, tenant_model, operation_model) {
           var result={};
           result.profile=function (data_state, callback){
               data_state.dao={
                   method:'POST',
                   action:"http://"+data_state.host+"/zendesk_login", 
                   data:{user:data_state.user, password:data_state.password, ip:data_state.ip},
                   error_property:"message"
               };
               

               $('#right').prepend("<h3 class='left_message'>Loading token, please wait ...</h3>");
               
               callback(null, data_state);
               
           };

          



           return common.naming_fns(result, "query_");
       }
      );
