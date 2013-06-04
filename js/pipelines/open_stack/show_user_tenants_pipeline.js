define([ "js/pipelines/dispatcher.js", "js/d3/cluster.js","js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js"],
       function(dispatcher, d3_cluster, Foreach_Pipeline,Pipeline) {

           var loading_operation_fn=function (data_state, callback){

               var data_operation=data_state.data_operation;
               $('#left').append("<h1 class='left_message'>Loading "+data_operation.title+",  please wait ...</h1>");
               $.ajax({
                   type: "POST",
                   url: "http://"+data_state.host+"/operations",
                   data:{token:data_state.token_id,  s_url: data_operation.url, s_host:data_operation.host.replace("http://", "") /**tenant_name:data_state.tenant_name**/}
               }).done(function( msg ) {
                   if(!msg.error){

                       $('#content').prepend( "<h2>"+data_operation.title+" loaded</h2><pre><code class='json'>"+toJson(msg)+"</code></pre>" );                                                  

                       data_state[data_operation.title]=msg;
                       callback(null, data_state);
                   }else{
                       callback(msg.error, data_state);
                   }
               });
           };
           
           var pipeline4=new Pipeline("loading_operation")
                   .addTransformation("loading_operation", 
                                      loading_operation_fn);

           var pipeline3=new Pipeline("show_available_operations")

                   .addTransformation("available_service_operations", function(data_state, callback){
                       data_state.suboptions_select=[];
                       if(data_state.option_service_selected.data("item").name=="glance"){
                           data_state.suboptions_select.push({item:{service_type:"image", url:"/v2.0/images"}, visible:"LIST IMAGES", hidden:'images'});
                       }
                       if(data_state.option_service_selected.data("item").name=="nova"){
                           data_state.suboptions_select.push({item:{service_type:"compute", url:"/images"}, visible:"LIST IMAGES", hidden:'nova-images'});
                           data_state.suboptions_select.push({item:{service_type:"compute", url:"/flavors"}, visible:"LIST FLAVORS", hidden:"nova-flavors"});
                           data_state.suboptions_select.push({item:{service_type:"compute", url:"/servers"}, visible:"LIST SERVERS", hidden:"nova-servers"});
                       }

                       var target_pipeline=this.pipeline;
                       function show_service_select(){
                          
                           var the_on_change_select_fn=function(select_dom_id){

                               return function(){
                                   //                                   alert(toJson(data_state.option_service_selected.data('item')));
                                   var selected=$(select_dom_id+" option:selected").first();



                                   
                                   data_state.operation_option=selected;
                                   data_state.operation_option.data('item').host=data_state.option_service_selected.data("item").endpoints[0].publicURL;
                                   data_state.operation_option.data('item').title=selected.val();
                                   data_state.data_operation=data_state.operation_option.data("item");
                                   // clean interface is a function declared in start_proposal
                                   clean_interface();
                                   //                                               show_tenant_endpoints_pipeline_fn();
                                   show_message_to_the_user("you have selected operation: "+selected.val());

                                   dispatcher.dispatch("select_service", target_pipeline,data_state, 
                                                       function(res,pipeline){alert("here");} );

                               };
                           };
                           //TODO: fn in start proposal, with global scope
                           show_dom_select("#suboptions", '#register_form',data_state.suboptions_select,  the_on_change_select_fn, true)();
                           callback(null, data_state);
                       }
                       //TODO fn in start proposal, with global scope
                       show_fn_result_to_the_user_and_wait('Please select an option  available ', 
                                                           show_service_select);


                   });
           
           var loading_endpoints_fn=function (data_state, callback){
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
                       $('#content').prepend( "<h2>endPoints loaded</h2><pre><code class='json'>"+toJson(msg)+"</code></pre>" );                                                  
                       callback(null, data_state);
                   }else{
                       callback(msg.error, data_state);
                   }
               });
           };


           var pipeline_show_services=new Pipeline("select_service_pipeline_for_current_tenant")
                   .addTransformation("Loading endpoints", 
                                      loading_endpoints_fn)
                   .addTransformation("show_select_endpoints", 
                                      function (data_state, callback){
                                          
                                          function show_endpoints_select(){
                                              function the_on_change_select_fn(select_dom_id){
                                                  return function (){
                                                      var option_selected=$(select_dom_id+" option:selected").first();
                                                      data_state.option_service_selected=option_selected;
                                                      show_message_to_the_user("you have selected service: "+data_state.option_service_selected.val());
                                                      callback(null, data_state);
                                                      
                                                  };
                                                  //                                              return endpointsOnChangeSelect(select_dom_id, data_state);
                                              }
                                              show_dom_select("#endpoints", "#register_form", data_state.service_catalog_select,  the_on_change_select_fn, true)();
                                          };

                                          // $('#tenants').fadeOut();
                                          show_fn_result_to_the_user_and_wait('Please select a service to use', 
                                                                              show_endpoints_select);


                                          
                                      }                      
                                     );
           
           
           var loading_tenants_fn=function (data_state, callback){
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
                       $('#content').prepend( "<h2>Tenants Loaded</h2><pre><code class='json'>"+toJson(msg)+"</code></pre>" );
                       callback(null, data_state);
                   }else{
                       callback(msg.error, data_state);
                   }
               });
           };

           var show_select_tenant_fn=function (data_state, callback){

               function show_tenant_select(){


                   //                                          var select_dom_id=;
                   var the_dom_place_to_append_the_select='#register_form';
                   var the_on_change_select_fn=function(select_dom_id){
                       return function(){
                           $("#suboptions").remove();

                           var selected=$(select_dom_id+" option:selected").first();
                           data_state.tenant_name=selected.val();
                           data_state.tenant_id=selected.data('item').id;


                           // clean interface is a function declared in start_proposal
                           clean_interface();
                           //                                               show_tenant_endpoints_pipeline_fn();
                           show_message_to_the_user("you have selected tenant: "+data_state.tenant_name);
                           callback(null, data_state);
                       };
                   };
                   //TODO: fn in start proposal, with global scope
                   show_dom_select("#tenants", the_dom_place_to_append_the_select,data_state.tenants_select,  the_on_change_select_fn, true)();
               }
               //TODO fn in start proposal, with global scope
               show_fn_result_to_the_user_and_wait('Please select a tenant to view its services available', 
                                                   show_tenant_select);
           };

           var pipeline1=new Pipeline("select_tenant_pipeline_for_current_user")
                   .addTransformation("loading_tenants_please_wait", 
                                      loading_tenants_fn)
                   .addTransformation("show_select_tenant", 
                                      show_select_tenant_fn);

           var pipeline_server=new Pipeline("create_server")
                   .addTransformation("create_server_loading_tenants", 
                                      loading_tenants_fn)
                   .addTransformation("create_server_show_select_tenants", 
                                      show_select_tenant_fn)
                   .addTransformation("create_server_loading_endpoints", 
                                      loading_endpoints_fn)
                   .addTransformation("create_server_select_nova_endpoint", 
                                      function(data_state, callback){
                                          var concordances=data_state.serviceCatalog.filter(function (element, index, array) {
                                              return (element.type == "compute");
                                          });
                                          data_state.nova_endpoint_url=concordances[0].endpoints[0].publicURL;
                                          
                                          callback(null, data_state);
                                      })
                   .addTransformation("create_server_load_nova_images", function(data_state, callback){
                       data_state.data_operation={title:"nova_images", url:"/images", host:data_state.nova_endpoint_url};
                       
                       loading_operation_fn(data_state, callback);
                   })
                   .addTransformation("create_server_load_nova_flavors", function(data_state, callback){
                       data_state.data_operation={title:"nova_flavors", url:"/flavors", host:data_state.nova_endpoint_url};
                       loading_operation_fn(data_state, callback);
                   })
                   .addTransformation("create_server_wait_for_the_name", function(data_state, callback){
                       $('#tenants').fadeOut();
                       
                       $('#register_form').append("<div id='server_name_form'><input type='text' id='server_name' value='test_server'></div>");

                                              
                                              $('#server_name').keypress( function(e){
                                                  if(e.which==13){
                                                  data_state.server_name=$('#server_name').val();
                                                      if(data_state.flavor_selected && data_state.image_selected)
                                                  callback(null, data_state);
                                                      else
                                                          alert("select first and image and flavor to create this server");
                                                      }else{

                                                         
                                                      }
                                              });
                   })
                   .addTransformation("create_server_call", function (data_state, callback){
                       
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
                   })
                   .set_on_success(function(results, pipeline){
                       alert("server_name: "+results.server_name+"\n------>endpoint: "+results.nova_endpoint_url+"\n---> first_image: "+results.nova_images.images[0].links[0].href+"\n--->first_flavor: "+
results.nova_flavors.flavors[0].links[0].href);
                       
                   })
           ;



           var d3_show_tenants=new Pipeline("d3_show_tenants")
           .addTransformation("d3_show_tenants", function(data_state, callback){
              

               var tenants=create_node("tenants", create_data("folder", {name:"tenants"}));
               data_state.tenants_select.map(function(item){
                   tenants.children.push(create_node(item.visible, create_data("tenant", {})));
               } );
               

               //  alert("here i am: "+toJson(data_state.d3_open_stack));
            data_state.d3_open_stack.children.push(tenants);
         
               function on_success_callback(){
                   callback(null, data_state);
               }

               d3_cluster($.extend(true, {}, data_state.d3_open_stack),
                          data_state, on_success_callback);
               // this line uncommented means that the user is using the select dropmenu to select the tenant, otherwise we have to useon_success_callback and wait to be called from d3 interface
      callback(null, data_state);
               
           });


   var d3_show_images_and_flavors_pipeline=new Pipeline("d3_show_images_and_flavors")
           .addTransformation("d3_show_images", function(data_state, callback){
               var images_node=create_node("images", create_data("folder", {name:"images"}));
            
               data_state.nova_images.images.map(function(item){
                   images_node.children.push(
                       create_node(item.name, create_data("image", {"href":item.links[0].href}
                                                          )));
               });
               function get_tenant(collection, key, searching){
                  
                   for(var i=0; i<collection.length; i++){
                       var interior=collection[i];
                       if(interior[key]==searching)
                           return interior;
                           }

                   throw "tentant dont find";
               };
                   get_tenant(data_state.d3_open_stack.children[0].children, "name", data_state.tenant_name).children.push(images_node);               

               function on_success_callback(){
                   callback(null, data_state);
               }

               d3_cluster($.extend(true, {}, data_state.d3_open_stack),
data_state, on_success_callback);
               //TODO remove if we need selection
                 callback(null, data_state);
               
           })
           .addTransformation("d3_show_flavors", function(data_state, callback){
               var flavors_node=create_node("flavors", create_data("folder", {name:"flavors"}));
            
               data_state.nova_flavors.flavors.map(function(item){
                   flavors_node.children.push(
                       create_node(item.name, create_data("flavor", 
                                                          {href:item.links[0].href})));
               });
               function get_tenant(collection, key, searching){
                  
                   for(var i=0; i<collection.length; i++){
                       var interior=collection[i];
                       if(interior[key]==searching)
                           return interior;
                           }

                   throw "tentant dont find";
               };
                   get_tenant(data_state.d3_open_stack.children[0].children, "name", data_state.tenant_name).children.push(flavors_node);               

               function on_success_callback(){
                   callback(null, data_state);
               }

               d3_cluster($.extend(true, {}, data_state.d3_open_stack),
data_state, on_success_callback);
               //TODO remove if we need selection
                 callback(null, data_state);
               
           });

           return {d3_show_tenants:d3_show_tenants, d3_show_images_and_flavors:d3_show_images_and_flavors_pipeline, create_server:pipeline_server,show_users:pipeline1, show_services:pipeline_show_services, show_operations:pipeline3, load_operation:pipeline4};

       });







