define(["js/common.js", "js/pipelines/dispatcher.js"],
       function(common, dispatcher) {
           var result= {
               prepare_tokens:function (data_state, callback){
                   var dao_object={method:'POST', action:"http://"+data_state.host+"/tokens", data:{s_user:data_state.user, s_pw:data_state.password, s_ip:data_state.ip}};
                   data_state.dao=dao_object;
                   $('#right').prepend("<h3 class='left_message'>Loading token, please wait ...</h3>");
                   callback(null, data_state);
                   
               },

                loaded_tokens:function (data_state, callback){
                    if(data_state.dao.result){
                        data_state.token_id=data_state.dao.result.access.token.id;

                        $('#content').prepend( "<h2>Token Loaded</h2><pre><code class='json'>"+common.toJson(data_state.dao.result)+"</code></pre>" );
                        $('#register_form').fadeOut(500).empty().fadeIn();
                        callback(null, data_state);
                       } else
                   callback(data_state.dao.error, data_state);
                   
                   
               },

               tokens:function (data_state, callback){
                  
                   $('#right').prepend("<h3 class='left_message'>Loading token, please wait ...</h3>");
                   $.ajax({
                       type: "POST",
                       url: "http://"+data_state.host+"/tokens",
                       data:{s_user:data_state.user, s_pw:data_state.password, s_ip:data_state.ip}
                   })

                       .done(function( msg ) {
                           //&& msg.indexOf("Error")>=-1
                       if(!msg.error ){
                           data_state.token_id=msg.access.token.id;
                           $('#content').prepend( "<h2>Token Loaded</h2><pre><code class='json'>"+common.toJson(msg)+"</code></pre>" );
                           
                           $('#register_form').fadeOut(500).empty().fadeIn();

                           callback(null, data_state);   
                       }else{
                           $('#content').prepend( "<h2>There is a problem with your account, try again please</h2>" );                                                  
                           callback(msg.error, data_state);
                       }
                   });
                   
               },

               prepare_operation:function (data_state, callback){
                   var data_operation=data_state.data_operation;
                   var dao_object={method:'POST', action:"http://"+data_state.host+"/operations", data:{token:data_state.token_id,  s_url: data_operation.url, s_host:data_operation.host.replace("http://", "") /**tenant_name:data_state.tenant_name**/}};
                   data_state.dao=dao_object;
                   $('#right').prepend("<h3 class='left_message'>Loading "+data_operation.title+", please wait ...</h3>");
                   callback(null, data_state);




                
               },

               show_operation_result:function(data_state, callback){
                   var data_operation=data_state.data_operation;
                   var msg=data_state.dao.result;
                   $('#content').prepend( "<h2>"+data_operation.title+" loaded</h2><pre><code class='json'>"+common.toJson(msg)+"</code></pre>" );                                                  
                           data_state[data_operation.title]=msg;
                           callback(null, data_state);

               },

               endpoints:function (data_state, callback){
                   $('#left').append("<h1 class='left_message'>Loading endpoints for: "+data_state.tenant_name+"  please wait ...</h1>");
                   $.ajax({
                       type: "POST",
                       url: "http://"+data_state.host+"/endpoints",
                       data:{s_user:data_state.user, s_pw:data_state.password, s_ip:data_state.ip, tenant_name:data_state.tenant_name}
                   }).done(function( msg ) {
                       if(!msg.error){

                           data_state.serviceCatalog=msg.access.serviceCatalog;
                           data_state.service_catalog_select=[];
                           msg.access.serviceCatalog.map(function(item){
                               data_state.service_catalog_select.push({item:item, hidden:item.name,visible:item.name+":"+item.type });
                           });
                           data_state.token_id=msg.access.token.id;
                           $('#content').prepend( "<h2>endPoints loaded</h2><pre><code class='json'>"+common.toJson(msg)+"</code></pre>" );                                                  
                           callback(null, data_state);
                       }else{
                           callback(msg.error, data_state);
                       }
                   });
               },

               tenants:function (data_state, callback){
                   $.ajax({
                       type: "POST",
                       url: "http://"+data_state.host+"/tenants",
                       data:{token:data_state.token_id, s_ip:data_state.ip}
                   }).done(function( msg ) {
                       if(!msg.error){

                           data_state.tenants_select=[];
                           msg.tenants.map(function(item){
                               data_state.tenants_select.push({hidden:item.name, visible:item.name, item:item});
                           });
                           $('#content').prepend( "<h2>Tenants Loaded</h2><pre><code class='json'>"+common.toJson(msg)+"</code></pre>" );
                           callback(null, data_state);
                       }else{
                           callback(msg.error, data_state);
                       }
                   });
               },

               glance_operations:function(data_state, callback){
                   data_state.suboptions_select=[];
                   data_state.suboptions_select.push({item:{service_type:"image", url:"/v2.0/images"}, visible:"LIST IMAGES", hidden:'images'});

                   
                   callback(null, data_state);

               },

               nova_operations:function(data_state, callback){
                   data_state.suboptions_select=[];
                   data_state.suboptions_select.push({item:{service_type:"compute", url:"/images"}, visible:"LIST IMAGES", hidden:'nova-images'});
                   data_state.suboptions_select.push({item:{service_type:"compute", url:"/flavors"}, visible:"LIST FLAVORS", hidden:"nova-flavors"});
                   data_state.suboptions_select.push({item:{service_type:"compute", url:"/servers"}, visible:"LIST SERVERS", hidden:"nova-servers"});
                   data_state.suboptions_select.push({item:{service_type:"compute", url:"/extensions"}, visible:"LIST EXTENSIONS", hidden:"nova-extensions"});


                   
                   callback(null, data_state);

               },

               create_server:function (data_state, callback){
                   
                   var data_operation=data_state.data_operation;
                   $('#left').append("<h1 class='left_message'>Finally , we are creating the server,   please wait ...</h1>");
                   $.ajax({
                       type: "POST",
                       url: "http://"+data_state.host+"/create_server",
                       data:{token:data_state.token_id, server_name:data_state.server_name,  endpoint:data_state.nova_endpoint_url, imageRef:data_state.image_selected, flavorRef:data_state.flavor_selected}
                   }).done(function( msg ) {
                       if(!msg.error){

                           $('#content').prepend( "<h2>Create server response: </h2><pre><code class='json'>"+toJson(msg)+"</code></pre>" );                                                  

                           callback(null, data_state);
                       }else{
                           callback(msg.error, data_state);
                       }
                   });
               }
           };

           return common.naming_fns(result);

       });
