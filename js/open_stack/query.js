define(["js/common.js", "js/pipelines/dispatcher.js","js/open_stack/model/token.js",  "js/open_stack/model/tenant.js"],
       function(common, dispatcher, token_model, tenant_model) {
           var result= {

               tokens:function (data_state, callback){
                   data_state.dao={
                       method:'POST',
                       action:"http://"+data_state.host+"/tokens", 
                       data:{s_user:data_state.user, s_pw:data_state.password, s_ip:data_state.ip},
                       error_property:"message"
                   };
                   

                   $('#right').prepend("<h3 class='left_message'>Loading token, please wait ...</h3>");
                   
                   callback(null, data_state);
                   
               },
               operation:function (data_state, callback){

                  var data_operation=data_state.operation_selected;
                   var host=data_state.endpoints[data_operation.service_type];
                   var dao_object={method:'POST', action:"http://"+data_state.host+"/operations", 
                                   data:{token:token_model.get_token_id(data_state),  
                                         s_url: data_operation.url, 
                                         s_host:host.replace("http://", "").replace(common.local_ip,data_state.ip ) /**tenant_name:data_state.tenant_name**/}};
                   data_state.dao=dao_object;
//                   console.dir(data_state);

//                   console.dir(dao_object);
                   callback(null, data_state);

               },
               endpoints:function (data_state, callback){
                   var dao_object={
                       method:'POST',
                       action:"http://"+data_state.host+"/endpoints",
                       data:{
                           s_user:data_state.user,
                           s_pw:data_state.password, 
                           s_ip:data_state.ip, 
                           tenant_name:tenant_model.get_selected_name(data_state)}};
                   data_state.dao=dao_object;
                   $('#right').prepend("<h3 class='left_message'>Loading endpoints, please wait ...</h3>");

                   callback(null, data_state);
                   
               },
               tenants:function(data_state, callback){
                   data_state.dao={
                       method:'POST',
                       action:"http://"+data_state.host+"/tenants", 
                       data:{token:token_model.get_token_id(data_state), s_ip:data_state.ip},
                       error_property:"message"
                   };

                   $('#right').prepend("<h3 class='left_message'>Loading tenants/projects, please wait ...</h3>");
                   
                   callback(null, data_state);

               },
               create_server:function (data_state, callback){
                   

                   $('#left').append("<h1 class='left_message'>Finally , we are creating the server,   please wait ...</h1>");
                   var dao_object={method:'POST', action:"http://"+data_state.host+"/create_server", data:{token:token_model.get_token_id(data_state), server_name:data_state.server_name,  endpoint:data_state.endpoints.nova.replace(common.local_ip,data_state.ip ), imageRef:data_state.image_selected, flavorRef:data_state.flavor_selected, network_id:data_state.network_selected}};
                   data_state.dao=dao_object;
                   callback(null,data_state);

                   


               },
               create_subnet:function (data_state, callback){
                   
                   var dao_object={method:'POST', action:"http://"+data_state.host+"/create_subnet", data:{token:token_model.get_token_id(data_state), network_id:data_state.network_selected, cidr:data_state.subnet_cidr,start:data_state.subnet_start, end:data_state.subnet_end, endpoint:data_state.endpoints.quantum.replace(common.local_ip,data_state.ip )  }};
                   data_state.dao=dao_object;
                   callback(null,data_state);
               },
               create_network:function (data_state, callback){

                   var dao_object={method:'POST', action:"http://"+data_state.host+"/create_network", data:{token:token_model.get_token_id(data_state), network_name:data_state.network_name,  endpoint:data_state.endpoints.quantum.replace(common.local_ip,data_state.ip )  }};
                   data_state.dao=dao_object;
                   callback(null,data_state);
               }
             
           };

           return common.naming_fns(result, "query_");

       });
