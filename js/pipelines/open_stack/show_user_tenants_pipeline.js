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

                 
                   .set_on_error(
                       function(error, pipeline){
                           alert("error"+toJson(error));})

           //        .apply_transformations(State())
           ;

           return pipeline1;

       });
