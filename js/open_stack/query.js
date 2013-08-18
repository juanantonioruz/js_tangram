define(["js/common.js", "js/pipelines/dispatcher.js"],
       function(common, dispatcher) {
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

                   var data_operation=data_state.data_operation;
                   var dao_object={method:'POST', action:"http://"+data_state.host+"/operations", 
                                   data:{token:data_state.token_id,  
                                         s_url: data_operation.url, 
                                         s_host:data_operation.host.replace("http://", "").replace(common.local_ip,data_state.ip ) /**tenant_name:data_state.tenant_name**/}};
                   data_state.dao=dao_object;
                   console.dir(data_state.dao);
                   $('#right').prepend("<h3 class='left_message'>Loading "+data_operation.title+", please wait ...</h3>");
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
                           tenant_name:data_state.tenant_name}};
                   data_state.dao=dao_object;
                   $('#right').prepend("<h3 class='left_message'>Loading endpoints, please wait ...</h3>");

                   callback(null, data_state);
                   
               },
               tenants:function(data_state, callback){
                   data_state.dao={
                       method:'POST',
                       action:"http://"+data_state.host+"/tenants", 
                       data:{token:data_state.token_id, s_ip:data_state.ip},
                       error_property:"message"
                   };

                   $('#right').prepend("<h3 class='left_message'>Loading tenants/projects, please wait ...</h3>");
                   
                   callback(null, data_state);

               },
               create_server:function (data_state, callback){
                   

                   $('#left').append("<h1 class='left_message'>Finally , we are creating the server,   please wait ...</h1>");
                   var dao_object={method:'POST', action:"http://"+data_state.host+"/create_server", data:{token:data_state.token_id, server_name:data_state.server_name,  endpoint:data_state.endpoints.nova.replace(common.local_ip,data_state.ip ), imageRef:data_state.image_selected, flavorRef:data_state.flavor_selected, network_id:data_state.network_selected}};
                   data_state.dao=dao_object;
                   callback(null,data_state);

                   


               },
               create_subnet:function (data_state, callback){
                   
                   var dao_object={method:'POST', action:"http://"+data_state.host+"/create_subnet", data:{token:data_state.token_id, network_id:data_state.network_selected, cidr:data_state.subnet_cidr,start:data_state.subnet_start, end:data_state.subnet_end, endpoint:data_state.endpoints.quantum.replace(common.local_ip,data_state.ip )  }};
                   data_state.dao=dao_object;
                   callback(null,data_state);
               },
               create_network:function (data_state, callback){

                   var dao_object={method:'POST', action:"http://"+data_state.host+"/create_network", data:{token:data_state.token_id, network_name:data_state.network_name,  endpoint:data_state.endpoints.quantum.replace(common.local_ip,data_state.ip )  }};
                   data_state.dao=dao_object;
                   callback(null,data_state);
                   
                   
               }



             
           };

           return common.naming_fns(result, "query_");







       });
