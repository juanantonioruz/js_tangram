define([ "js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js"],
       function( Foreach_Pipeline,Pipeline) {

           var pipeline1=new Pipeline("testing openstack api ")
                   .addTransformation("loading_tokens_please_wait", 
                                      function (data_state, callback){
                                          $('#left').append("<h1 class='left_message'>Loading token, please wait ...</h1>");
                                          $.ajax({
                                              type: "POST",
                                              url: "http://localhost:3000/tokens",
                                              data:{s_user:data_state.user, s_pw:data_state.password}
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
                                              url: "http://localhost:3000/tenants",
                                              data:{token:data_state.token_id}
                                          }).done(function( msg ) {
                                              if(!msg.error){

                                                  //do that to use with foreach pipeline

                                                  data_state.tenants=[];
                                                 msg.tenants.map(function(item){
                                                  data_state.tenants.push(item.name);
                                                  });
                                                  $('#content').prepend( "<h2>Tenants Loaded</h2><pre><code class='json'>"+toJson(msg)+"</code></pre>" );
                                                  callback(null, data_state);
                                              }else{
                                                  callback(msg.error, data_state);
                                              }
                                          });
                                      })           

                   .set_on_success(
                       function(results, pipeline){
                           document.state=results;
                           $('#loading').fadeOut(1000, function(){
                               $('.left_message').remove();
                               $('#register_form').empty();
                               $('#loading')
                                   .html('The content is already loaded!<br> Please select a tenant to view its endpoints')
                                   .css('background-color', 'yellow')
                                   .fadeIn(1000, function(){
                                       $('#left').append("ENDING OPENSTACKS CALLS");
                                        $('#register_form').append("<select id='tenants'></select>");
                                       $.each(results.tenants, function(i, value){
                                           $("#tenants").append("<option value='"+value+"'>"+value+"</option>");
                                       });
                                       $("#tenants").prop("selectedIndex", -1);
                                       $("#tenants").change(function(){
                                           var selected=$("#tenants option:selected").first().val();
//                                           alert("trying to show: "+selected+" with "+document.state.token_id);
                                       });

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
