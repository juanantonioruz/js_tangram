define(["js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js"],
       function(Foreach_Pipeline,Pipeline) {


           var pipeline4=new Pipeline("loading_operation")
                   .addTransformation("loading_operation", 
                                      function (data_state, callback){
                                          var data_operation=data_state.operation_option.data('item');
                                          $('#left').append("<h1 class='left_message'>Loading "+data_operation.title+",  please wait ...</h1>");
                                          $.ajax({
                                              type: "POST",
                                              url: "http://"+data_state.host+"/operations",
                                              data:{token:data_state.token_id,  s_url: data_operation.url, s_host:data_operation.host.replace("http://", "") /**tenant_name:data_state.tenant_name**/}
                                          }).done(function( msg ) {
                                              if(!msg.error){

                                                  $('#content').prepend( "<h2>Images List loaded</h2><pre><code class='json'>"+toJson(msg)+"</code></pre>" );                                                  
                                                  callback(null, data_state);
                                              }else{
                                                  callback(msg.error, data_state);
                                              }
                                          });
                                      });

           var pipeline3=new Pipeline("show_available_operations")
              .addTransformation("available_service_operations", function(data_state, callback){
                       data_state.suboptions_select=[];
                       if(data_state.option_service_selected.data("item").name=="glance"){
                           data_state.suboptions_select.push({item:{service_type:"image", url:"/v2.0/images"}, visible:"LIST IMAGES", hidden:'images'});
                       }
                       if(data_state.option_service_selected.data("item").name=="nova"){
                           data_state.suboptions_select.push({item:{service_type:"compute", url:"/images"}, visible:"LIST IMAGES", hidden:'images'});
                           data_state.suboptions_select.push({item:{service_type:"compute", url:"/flavors"}, visible:"LIST FLAVORS", hidden:"flavors"});
                           data_state.suboptions_select.push({item:{service_type:"compute", url:"/servers"}, visible:"LIST SERVERS", hidden:"servers"});
                       }

                       function show_service_select(){
                           var the_on_change_select_fn=function(select_dom_id){
                               return function(){
                                   //                                   alert(toJson(data_state.option_service_selected.data('item')));
                                   var selected=$(select_dom_id+" option:selected").first();



                                   
                                   data_state.operation_option=selected;
                                   data_state.operation_option.data('item').host=data_state.option_service_selected.data("item").endpoints[0].publicURL;
                                   data_state.operation_option.data('item').title=selected.val();

                                   // clean interface is a function declared in start_proposal
                                   clean_interface();
                                   //                                               show_tenant_endpoints_pipeline_fn();
                                   show_message_to_the_user("you have selected operation: "+selected.val());
                                   callback(null, data_state);
                               };
                           };
                           //TODO: fn in start proposal, with global scope
                           show_dom_select("#suboptions", '#register_form',data_state.suboptions_select,  the_on_change_select_fn, true)();
                       }
                       //TODO fn in start proposal, with global scope
                       show_fn_result_to_the_user_and_wait('Please select an option  available ', 
                                                           show_service_select);

                   });
                  


           var pipeline2=new Pipeline("select_service_pipeline_for_current_tenant")
                   .addTransformation("Loading endpoints", 
                                      function (data_state, callback){
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
                                      })
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
                 
                
                 

           


           var pipeline1=new Pipeline("select_tenant_pipeline_for_current_user")
                   .addTransformation("loading_tokens_please_wait", 
                                      function (data_state, callback){
                                          $('#left').append("<h1 class='left_message'>Loading token, please wait ...</h1>");
                                          $.ajax({
                                              type: "POST",
                                              url: "http://"+data_state.host+"/tokens",
                                              data:{s_user:data_state.user, s_pw:data_state.password, s_ip:data_state.ip}
                                          }).done(function( msg ) {
                                              if(!msg.error){

                                                  data_state.token_id=msg.access.token.id;
                                                  $('#content').prepend( "<h2>Token Loaded</h2><pre><code class='json'>"+toJson(msg)+"</code></pre>" );                                                  
                                                  callback(null, data_state);
                                              }else{
                                                  callback(msg.error, data_state);
                                              }
                                          });
                                          
                                      })
                   .addTransformation("loading_tenants_please_wait", 
                                      function (data_state, callback){
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
                                      })
                   .addTransformation("show_select_tenant", 
                                      function (data_state, callback){

                                          function show_tenant_select(){
                                              $('#register_form').empty();

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
                                      })
                

           ;

           return {show_users:pipeline1, show_services:pipeline2, show_operations:pipeline3, load_operation:pipeline4};

       });








