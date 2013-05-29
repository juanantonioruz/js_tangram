define([ "js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js"],
       function( Foreach_Pipeline,Pipeline) {

           return new Pipeline("testing openstack api ")
                   .addTransformation("loading_tokens_please_wait", 
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



       });
