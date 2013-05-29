define(["js/pipelines/json_data.js", "js/pipelines/dispatcher.js", "js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js","js/pipelines/state_type.js", "js/pipelines/helper_display.js","js/async.js"],
       function(json_data, dispatcher, Foreach_Pipeline,Pipeline, State,  display, async) {


           var foreach_pipeline=new Foreach_Pipeline("foreach_tenant", "the_model")
                   .addTransformation("endpoints_of_tenant", 
                                      function (data_state, callback){
                                          $('#left').append("<h4 class='left_message'>Loading endpoints of "+data_state.current_data.name+", please wait ...</h4>"); 
                                          $.ajax({
                                              type: "POST",
                                              url: "http://localhost:3000/endpoints",
                                              data:{s_user:data_state.user, s_pw:data_state.password, tenant_name:data_state.current_data.name}
                                          }).done(function( msg ) {
                                              if(!msg.error){
                                                  $('#content').prepend( "<h2>End Points for "+data_state.current_data.name+" Loaded</h2><pre><code class='json'>"+toJson(msg)+"</code></pre>" );

                                                  
                                                  callback(null, data_state);
                                              }else{
                                                  callback(msg.error, data_state);
                                              }
                                          });


                                      })
                   .set_on_success(
                       function(results, pipeline){
                           $('#fn_transformation').html(" fin de foreach!");
                       })
                   .set_on_error(
                       function(error, pipeline){
                           alert("error"+toJson(error));});

           var pipeline1=new Pipeline("testing openstack api ")
                   .addTransformation("loading_tokens_please_wait", 
                                      function (data_state, callback){
                                          $('#left').append("<h1 class='left_message'>Loading tokens, please wait ...</h1>");
                                          $.ajax({
                                              type: "POST",
                                              url: "http://localhost:3000/tokens",
                                              data:{s_user:data_state.user, s_pw:data_state.password}
                                          }).done(function( msg ) {
                                              if(!msg.error){
                                                  $('#content').prepend( "<h2>Tokens Loaded</h2><pre><code class='json'>"+toJson(msg)+"</code></pre>" );
                                                  data_state.token_id=msg.access.token.id;
                                                  
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
                                              url: "http://localhost:3000/tenants",
                                              data:{token:data_state.token_id}
                                          }).done(function( msg ) {
                                              if(!msg.error){
                                                  $('#content').prepend( "<h2>Tenants Loaded</h2><pre><code class='json'>"+toJson(msg)+"</code></pre>" );
                                                  //do that to use with foreach pipeline

                                                  data_state.the_model=msg.tenants;
                                                  
                                                  callback(null, data_state);
                                              }else{
                                                  callback(msg.error, data_state);
                                              }
                                          });
                                          
                                      })
           
           // .addTransformation("testing user admin token", 
           //                    function (data_state, callback){
           //                        $('#left').append("<h1 class='left_message'>testing admin_token ...</h1>");
           //                        $.ajax({
           //                            type: "GET",
           //                            url: "http://localhost:3000/tokens/"+auth_token_user_demo,
           //                            headers: { "X-Auth-Token": "tokentoken" }
           //                        }).done(function( msg ) {
           //                            $('#content').prepend( "<h2>Testing admin token</h2><pre><code class='json'>"+toJson(msg)+"</code></pre>" );
           //                            callback(null, data_state);
           //                        });
           //                    })
                   .addPipe(foreach_pipeline)
                   .set_on_success(
                       function(results, pipeline){
                           $('#loading').fadeOut(1000, function(){
                               $('.left_message').remove();
                               $('#loading')
                                   .html('The content is already loaded!')
                                   .css('background-color', 'yellow')
                                   .fadeIn(1000, function(){
                                       $('#left').append("ENDING OPENSTACKS CALLS");

                                   });

                           });
                           $('#fn_transformation').html(" process ended!");
                           //                               console.log(toJson(results));

                       })
                   .set_on_error(
                       function(error, pipeline){
                           alert("error"+toJson(error));})

           //        .apply_transformations(State())
           ;

           return pipeline1;

       });
