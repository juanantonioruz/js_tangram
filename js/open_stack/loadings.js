define(["js/common.js", "js/pipelines/dispatcher.js"],
       function(common, dispatcher) {
           var result= {




               store_token_id:function (data_state, callback){
                   if(data_state.dao.result){
                       data_state.token_id=data_state.dao.result.access.token.id;

                       $('#content').prepend( "<h2>Token Loaded</h2><pre><code class='json'>"+common.toJson(data_state.dao.result)+"</code></pre>" );
                       $('#register_form').fadeOut(500).empty().fadeIn();

                       callback(null, data_state);

                   } else
                   callback(data_state.dao.error, data_state);
                   
                   
               },
               store_endpoints:function (data_state, callback){
                   //TODO : use error case if(dao.error)

                   if(data_state.dao.error){
                       callback("load_endpoints.error->"+data_state.dao.error, data_state);
                   }else{
                       data_state.serviceCatalog=data_state.dao.result.access.serviceCatalog;
                       data_state.service_catalog_select=[];
                       data_state.dao.result.access.serviceCatalog.map(function(item){
                           //TODO  related to openstack local conf

                           if(data_state.ip.indexOf(common.local_ip)!=-1){
                               console.log("---_____"+item.endpoints[0].publicURL);

                               item.endpoints[0].publicURL=item.endpoints[0].publicURL.replace(common.local_ip,data_state.ip );
                           }
                           // end change
                           data_state.service_catalog_select.push({item:item, hidden:item.name,visible:item.name+":"+item.type });
                       });
                       data_state.token_id=data_state.dao.result.access.token.id;
                       $('#content').prepend( "<h2>endPoints loaded</h2><pre><code class='json'>"+common.toJson(data_state.dao.result)+"</code></pre>" );                                                  
                       data_state.endpoints={};
                       data_state.service_catalog_select.map(function(item){
                           data_state.endpoints[item.hidden]=item.item.endpoints[0].publicURL.replace(common.local_ip,data_state.ip );
                       });

                       $('#content').prepend( "<h2>endPoints analysed:</h2><pre><code class='json'>"+common.toJson(data_state.endpoints)+"</code></pre>" );                                             

                       


                       callback(null, data_state);
                   }

                   
               },
               store_tenants:function (data_state, callback){
                   if(data_state.dao.result){

                       data_state.tenants_select=[];
                       data_state.dao.result.tenants.map(function(item){
                           data_state.tenants_select.push({hidden:item.name, visible:item.name, item:item});
                       });

                       $('#content').prepend( "<h2>Tenants Loaded</h2><pre><code class='json'>"+common.toJson(data_state.dao.result)+"</code></pre>" );


                       callback(null, data_state);

                   } else{
                       $('#content').prepend( "<h2>Error while Tenants Loaded</h2><pre><code class='json'>"+common.toJson(data_state.dao.error)+"</code></pre>" );

                       callback(data_state.dao.error, data_state);
                   }
                   
               },


               show_operation_result:function(data_state, callback){
                   var data_operation=data_state.data_operation;
                   var msg=data_state.dao.result;
                   $('#content').prepend( "<h2>"+data_operation.title+" loaded</h2><pre><code class='json'>"+common.toJson(msg)+"</code></pre>" );                                                  
                   data_state[data_operation.title]=msg;
                   //                   alert(data_operation.title);
                   callback(null, data_state);

               },


               show_create_result:function(data_state, callback){
                   $('#content').prepend( "<h2>Create  response: </h2><pre><code class='json'>"+common.toJson(data_state.dao.result)+"</code></pre>" );                                  callback(null, data_state);
               }
           };

           return common.naming_fns(result);







       });
