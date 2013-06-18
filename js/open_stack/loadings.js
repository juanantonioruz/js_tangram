define(["js/common.js", "js/pipelines/dispatcher.js"],
       function(common, dispatcher) {
           var result= {
               prepare_tokens:function (data_state, callback){
                   var dao_object={method:'POST', action:"http://"+data_state.host+"/tokens", data:{s_user:data_state.user, s_pw:data_state.password, s_ip:data_state.ip}};
                   data_state.dao=dao_object;
                   $('#right').prepend("<h3 class='left_message'>Loading token, please wait ...</h3>");
                   callback(null, data_state);
                   
               },

               store_token_id:function (data_state, callback){
                   if(data_state.dao.result){
                       data_state.token_id=data_state.dao.result.access.token.id;

                       $('#content').prepend( "<h2>Token Loaded</h2><pre><code class='json'>"+common.toJson(data_state.dao.result)+"</code></pre>" );
                       $('#register_form').fadeOut(500).empty().fadeIn();
                       callback(null, data_state);
                   } else
                   callback(data_state.dao.error, data_state);
                   
                   
               },

               prepare_operation:function (data_state, callback){
                   var data_operation=data_state.data_operation;
                   var dao_object={method:'POST', action:"http://"+data_state.host+"/operations", data:{token:data_state.token_id,  s_url: data_operation.url, s_host:data_operation.host.replace("http://", "").replace('192.168.1.100',data_state.ip ) /**tenant_name:data_state.tenant_name**/}};
                   data_state.dao=dao_object;
                   $('#right').prepend("<h3 class='left_message'>Loading "+data_operation.title+", please wait ...</h3>");
                   console.dir(dao_object);
                   callback(null, data_state);

               },

               show_operation_result:function(data_state, callback){
                   var data_operation=data_state.data_operation;
                   var msg=data_state.dao.result;
                   $('#content').prepend( "<h2>"+data_operation.title+" loaded</h2><pre><code class='json'>"+common.toJson(msg)+"</code></pre>" );                                                  
                   data_state[data_operation.title]=msg;
                   callback(null, data_state);

               },
               prepare_endpoints:function (data_state, callback){
                   var dao_object={method:'POST', action:"http://"+data_state.host+"/endpoints", data:{s_user:data_state.user, s_pw:data_state.password, s_ip:data_state.ip, tenant_name:data_state.tenant_name}};
                   data_state.dao=dao_object;
                   $('#right').prepend("<h3 class='left_message'>Loading endpoints, please wait ...</h3>");

                   callback(null, data_state);
                   
               },
               store_endpoints:function (data_state, callback){
                   //TODO : use error case if(dao.error)
                   var x=data_state.dao.result;
                   if(data_state.dao.error){
                           callback("laod_endpoints.error->"+data_state.dao.error, data_state);
                   }else{
 data_state.serviceCatalog=x.access.serviceCatalog;
                           data_state.service_catalog_select=[];
                           x.access.serviceCatalog.map(function(item){
                               //TODO  related to openstack local conf
                               if(data_state.ip.indexOf('192.168.1.100')!=-1)
                               item.endpoints[0].publicURL=item.endpoints[0].publicURL.replace('192.168.1.100',data_state.ip );
                               // end change
                               data_state.service_catalog_select.push({item:item, hidden:item.name,visible:item.name+":"+item.type });
                           });
                           data_state.token_id=x.access.token.id;
                           $('#content').prepend( "<h2>endPoints loaded</h2><pre><code class='json'>"+common.toJson(x)+"</code></pre>" );                                                  
                           callback(null, data_state);
                   }

           
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

               cinder_operations:function(data_state, callback){
                   data_state.suboptions_select=[];
                   data_state.suboptions_select.push({item:{service_type:"volume", url:"/volumes"}, visible:"LIST VOLUMES", hidden:'cinder-volumes'});
                   data_state.suboptions_select.push({item:{service_type:"volume", url:"/types"}, visible:"LIST VOLUME TYPES", hidden:'cinder-volumes-types'});
                   data_state.suboptions_select.push({item:{service_type:"volume", url:"/snapshots"}, visible:"LIST SNAPSHOTS", hidden:'cinder-snapshots'});
                   
                   callback(null, data_state);

               },
               nova_operations:function(data_state, callback){
                   data_state.suboptions_select=[];
                   data_state.suboptions_select.push({item:{service_type:"compute", url:"/images"}, visible:"LIST IMAGES", hidden:'nova-images'});
                   data_state.suboptions_select.push({item:{service_type:"compute", url:"/flavors"}, visible:"LIST FLAVORS", hidden:"nova-flavors"});
                   data_state.suboptions_select.push({item:{service_type:"compute", url:"/servers"}, visible:"LIST SERVERS", hidden:"nova-servers"});
                   data_state.suboptions_select.push({item:{service_type:"compute", url:"/extensions"}, visible:"LIST EXTENSIONS", hidden:"nova-extensions"});
                   data_state.suboptions_select.push({item:{service_type:"compute", url:"/limits"}, visible:"LIST LIMITS", hidden:"nova-limits"});
                   data_state.suboptions_select.push({item:{service_type:"compute", url:"/os-agents"}, visible:"OS AGENTS", hidden:"os-agents"});
                   data_state.suboptions_select.push({item:{service_type:"compute", url:"/os-aggregates"}, visible:"OS AGGREGATES", hidden:"os-aggregates"});
                   data_state.suboptions_select.push({item:{service_type:"compute", url:"/os-hosts"}, visible:"OS HOSTS", hidden:"os-hosts"});
                   data_state.suboptions_select.push({item:{service_type:"compute", url:"/os-services"}, visible:"OS SERVICES", hidden:"os-services"});


                   
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
