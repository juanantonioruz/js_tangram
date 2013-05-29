define([ "js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js"],
       function( Foreach_Pipeline,Pipeline) {

           


           return new Pipeline("show_tenant_endpoints_pipeline ")
               .addTransformation("show_select_tenant", 
                                  function (data_state, callback){
                                      function show_tenant_select(){
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
               .addTransformation("loading_tokens_please_wait", 
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
           

               .set_on_error(
                   function(error, pipeline){
                       alert("error"+toJson(error));})

           //        .apply_transformations(State())
           ;



       });
