require.config({
    urlArgs: "bust=" + (new Date()).getTime()
});

define(["js/pipelines/json_data.js", "js/pipelines/dispatcher.js", "js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js","js/pipelines/state_type.js", "js/pipelines/helper_display.js","js/async.js"],
       function(json_data, dispatcher, Foreach_Pipeline,Pipeline, State,  display, async) {

           var timeOut=1000;


           var p=function(){
                $('#left').append("<h1 id='loading'>openstack testing</h1>");
               $('#left').append("<b id='fn_transformation'>starting simulation  init</b><hr><div id='proposal'></div>");

               
               var foreach_pipeline=new Foreach_Pipeline("foreach_tenant", "the_model")
                       .addTransformation("servers_of_tenant", 
                                          function (data_state, callback){
                                              var that=this;
                                              setTimeout(function () {



                                                  $('#content').prepend( "<pre><code class='json'>"+toJson(data_state.current_data)+"</code></pre>" );
                                                   $.ajax({
                                                  type: "GET",
                                                  url: "http://localhost:3000/tenant_servers/"+data_state.current_data.id
                                                  
                                              }).done(function( msg ) {
                                                  $('#content').prepend( "<br>Servers of this tenant id: "+data_state.current_data.id
+"<br><pre><code class='json'>{}"+toJson(msg)+"</code></pre>" );
  //                                                alert(toJson(msg));
                                                   callback(null, data_state);
                                              });
                                              }, timeOut);
                                          })
                       

                       .set_on_success(
                           function(results, pipeline){
                               $('#fn_transformation').html(" fin de foreach!");
                           })
                       .set_on_error(
                           function(error, pipeline){
                               alert("error"+toJson(error));});
               



               var pipeline1=new Pipeline("testing openstack api ")
                       .addTransformation("loading_content_please_wait", 
                                          function (data_state, callback){
 
                                              $('#left').append("<h1 class='left_message'>Loading tenants, please wait ...</h1>");
                                              $.ajax({
                                                  type: "GET",
                                                  url: "http://localhost:3000/tenants",
                                                  headers: { "X-Auth-Token": "tokentoken" }
                                              }).done(function( msg ) {
                                                  $('#content').prepend( "<h2>Loading tenants</h2><pre><code class='json'>"+toJson(msg)+"</code></pre>" );
                                                  data_state.the_model=msg.tenants;
                                                   callback(null, data_state);
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
                       // .addPipe(foreach_pipeline)
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
                       .apply_transformations(State());
               
           };




           // EOP
           dispatcher.reset();
           
           // Filtering all tansformations ::: AOP 
           dispatcher.reset_filters();

           // filtering for timming
           dispatcher.filter( function(data_state, callback){
               var that=this;
               setTimeout(function () {
                   var history_message=that.transformation_event_type+"/"+
                           that.target.ns+((that.transformation_event_type=="ON_END")? " finished in "+that.target.diff+"ms":" ... timing ..." );
                   if(contains(history_message, "state_step_"))
                       history_message=" -------- "+history_message;
                   $('#history_status').append("<li>"+history_message.replace("ON_", "")+"</li>");

                   callback(null, data_state);
               }, 10);});

           // filtering to demo display 
           // dispatcher.filter( function(data_state, callback){
           //     var that=this;
           //     setTimeout(function () {
           //         if(that.transformation_event_type=="ON_END"){
           //             $('#proposal').append("DONE: <b>"+that.target.ns+".</b> In Time: "+that.target.diff+"<br>");                 
           //             if(data_state[that.target.ns])
           //                 $('#proposal').append("<span>"+toJson(data_state[that.target.ns].demo.data)+"</span><br><br>");                    
           //         }
           //         callback(null, data_state);
           //     }, 10);});

           return p;

       });
