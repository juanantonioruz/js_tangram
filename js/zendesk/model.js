define(["js/common.js","js/open_stack/events.js", "js/pipelines/dispatcher.js", "js/open_stack/model/tenant.js","js/open_stack/model/operation.js"],
       function(common, events, dispatcher, tenant_model, operation_model) {
           var result={};
         
           

           result.load_profile=function (data_state, callback){
//               console.dir(data_state.dao.result);
               data_state.profile=data_state.dao.result.users[0];
                   callback(null, data_state);
           };
           

           result.load_organizations=function (data_state, callback){
//               console.dir(data_state.dao.result);
               data_state.organizations=data_state.dao.result.organizations;
                   callback(null, data_state);
           };

           result.load_base=function (data_state, callback){
               this.ns=this.ns.replace("base", this.key);
//               console.dir(data_state.dao.result);
               data_state[this.key]=data_state.dao.result[this.dao_key];
                   callback(null, data_state);
           };


           return common.naming_fns(result, "model_");
       }
      );
