define(["js/common.js","js/open_stack/events.js", "js/pipelines/dispatcher.js", "js/open_stack/model/tenant.js","js/open_stack/model/operation.js"],
       function(common, events, dispatcher, tenant_model, operation_model) {

           function init_data(data_state){
               return {user:data_state.user, password:data_state.password, ip:data_state.ip};
           }

           var result={};
           result.base=function (data_state, callback){
               this.ns=this.ns.replace("base", this.query);
               $('#right').prepend("<h3 class='left_message'>"+this.query+"</h3>");
               var the_data=init_data(data_state);
               var operations_map={"profile":"users", organizations:"organizations", tickets:"tickets", groups:"groups", topics:"topics", users:"users"};

                  the_data.operation=operations_map[this.query];
               
               data_state.dao={
                   method:'POST',
                   action:"http://"+data_state.host+"/zendesk", 
                   data:the_data,
                   error_property:"message"
               };
               

//               $('#right').prepend("<h3 class='left_message'>Loading "+this.query+", please wait ...</h3>");
               
               callback(null, data_state);
               
           };


           result.create=function (data_state, callback){
               this.ns+= this.query;
 //              $('#right').prepend("<h3 class='left_message'>Creating: "+this.query+"</h3>");
               var the_data=init_data(data_state);
               var operations_map={ organization:"organizations", ticket:"tickets", group:"groups", topic:"topics", user:"users"};
               the_data.model=data_state[this.data_key_options];
                  the_data.operation=operations_map[this.query];
               
               data_state.dao={
                   method:'POST',
                   action:"http://"+data_state.host+"/zendesk_create", 
                   data:the_data,
                   error_property:"message"
               };
         callback(null, data_state);
                   
               };


           result.update=function (data_state, callback){
               this.ns+= this.query;
 //              $('#right').prepend("<h3 class='left_message'>Creating: "+this.query+"</h3>");
               var the_data=init_data(data_state);
               var operations_map={ organization:"organizations", ticket:"tickets", group:"groups", topic:"topics", user:"users"};
               the_data.model=data_state[this.data_key_options];
               the_data.operation=operations_map[this.query];
               the_data.id=data_state[this.key_id_stored];
               console.dir(the_data);
               data_state.dao={
                   method:'POST',
                   action:"http://"+data_state.host+"/zendesk_update", 
                   data:the_data,
                   error_property:"message"
               };
         callback(null, data_state);
                   
               };


               result.load=function (data_state, callback){
                   this.ns+= "_"+this.query;
                   
                   var the_data=init_data(data_state);
                   var operations_map={ organization:"organizations", ticket:"tickets", group:"groups", topic:"topics", user:"users"};

                   the_data.operation=operations_map[this.query];
                   
                   the_data.id=data_state[this.key_id_stored];
                   
                   data_state.dao={
                       method:'POST',
                       action:"http://"+data_state.host+"/zendesk_load", 
                       data:the_data,
                       error_property:"message"
                   };
                   

                   
                   
                   callback(null, data_state);
                   
               };



               return common.naming_fns(result, "query_");
       }
      );
