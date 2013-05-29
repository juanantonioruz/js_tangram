define(["js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js"],
       function(Foreach_Pipeline,Pipeline) {

           var pipeline1=new Pipeline("testing openstack api ")
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
                                                      var selected=$(select_dom_id+" option:selected").first().val();
                                                      data_state.tenant_name=selected;

                                                      // clean interface is a function declared in start_proposal
                                                      clean_interface();
                                                      //                                               show_tenant_endpoints_pipeline_fn();
                                                      callback(null, data_state);
                                                  };
                                              };
                                              //TODO: fn in start proposal, with global scope
                                              show_dom_select("#tenants", the_dom_place_to_append_the_select,data_state.tenants_select,  the_on_change_select_fn)();
                                          }
                                          //TODO fn in start proposal, with global scope
                                          show_fn_result_to_the_user_and_wait('Please select a tenant to view its endpoints', 
                                                                              show_tenant_select);
                                      })
           

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
                                     )
                   .addTransformation("available_service_operations", function(data_state, callback){
                       data_state.suboptions_select=[];
                               if(data_state.option_service_selected.data("item").name=="glance"){
                                   data_state.suboptions_select.push({item:"glance", visible:"LIST IMAGES", hidden:"glance list images"});
                               }

                       function show_service_select(){
                          // $('#register_form').empty();
                            

                           var the_on_change_select_fn=function(select_dom_id){
                               

                               return function(){
//                                   alert(toJson(data_state.option_service_selected.data('item')));
                                   var selected=$(select_dom_id+" option:selected").first();
                                   data_state.service_name=selected.hidden;
                                   data_state.s_host=data_state.option_service_selected.data("item").endpoints[0].publicURL;

                                   // clean interface is a function declared in start_proposal
                                   clean_interface();
                                   //                                               show_tenant_endpoints_pipeline_fn();
                                   callback(null, data_state);
                               };
                           };
                           //TODO: fn in start proposal, with global scope
                           show_dom_select("#suboptions", '#register_form',data_state.suboptions_select,  the_on_change_select_fn)();
                       }
                       //TODO fn in start proposal, with global scope
                       show_fn_result_to_the_user_and_wait('Please select a service available ', 
                                                           show_service_select);



                       // $('#suboptions').remove();
                       // var service_selected=data_state.option_service_selected.data("item");
                       // $('#register_form').append("<div id='suboptions'><h2>Currently available for: "+service_selected.name+" </h2><select id='suboptions_available'></select></div> ");
                       // if(service_selected.name=="glance"){
                       //     $('#suboptions_available').append("<option>LIST IMAGES</option>");
                       //     clean_interface();
                       //     data_state.s_host=service_selected.endpoints[0].publicURL;
                           
                       //     callback(null, data_state);
                       // };

                   })
           .addTransformation("loading_list_images", 
                              function (data_state, callback){
                                  $('#left').append("<h1 class='left_message'>Loading list images,  please wait ...</h1>");
                                  $.ajax({
                                      type: "POST",
                                      url: "http://"+data_state.host+"/glance/list_images",
                                      data:{token:data_state.token_id,  s_host:data_state.s_host.replace("http://", "") /**tenant_name:data_state.tenant_name**/}
                                  }).done(function( msg ) {
                                      if(!msg.error){

                                          $('#content').prepend( "<h2>Images List loaded</h2><pre><code class='json'>"+toJson(msg)+"</code></pre>" );                                                  
                                          callback(null, data_state);
                                      }else{
                                          callback(msg.error, data_state);
                                      }
                                  });
                              })

                   .set_on_error(
                       function(error, pipeline){
                           alert("error"+toJson(error));})

           //        .apply_transformations(State())
           ;

           return pipeline1;

       });
