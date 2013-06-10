require.config({
    urlArgs: "bust=" + (new Date()).getTime()
});

define(["js/dev/pipes.js", "js/open_stack/filters.js", "js/pipelines/state_type.js", "js/pipelines/dispatcher.js", "js/pipelines/mapper_pipeline_type.js", "js/pipelines/pipeline_type.js", "js/ew_related/helper_display.js","js/async.js", "js/d3/history_cluster.js"],
       function(pipes, filters, State, dispatcher,Mapper_Pipeline, Pipeline, display, async, history_cluster) {
           var app_data=State();
           // console.log(toJson(json_data));
           dispatcher.Pipeline=Pipeline;
           app_data.mapper_condition_example=true;

         

           var on_success=function(res, pipeline){

               pipeline.getSteps().map(
                   function(step){
                       
                       display.jqueryIterateAndDisplayHistoryStep("#left", step.ns, step,  "history");
                   }
               );

               display.jqueryIterateAndDisplayHistoryStep("#center", pipeline.ns, pipeline, "history");

           };

           var on_error=function(err, pipeline){alert(err); };


           function clean_out(){
               $('#left').empty();

               $('#center').empty();
               $('#history_status').empty();
               $('#history_status').append("<b>transformation event history of pipelines and steps</b><br><br>");             
               dispatcher.reset();
           };



     

     

           function init_history(first){
               app_data.history=[];
               app_data.history.push(first);
               return app_data;
           }

          
           function get_alert(message){
               return function(res, pipeline){
                   //var extended_message=message+" in pipeline: "+ ((pipeline)? pipeline.ns: "no_pipeline")+"\n"+toJson((res)? res : "no res!");

                   //console.log(extended_message);
                   // alert(extended_message);
               };
           }
           var  on_success_pipe=function(message){
               return function(res, pipeline){
                   on_success(res, pipeline); 
                //   get_alert(message);
                   
               };};

       

           function init_display(){
               dispatcher.reset();
              dispatcher.reset_filters();
               
               $('#input_user').append(
                   '<input type="button" id="start_pipeline" value="start day and noon!"/><br>'+
                       '<input type="button" id="compose_pipelines" value="start composition pipelines: \'start day and noon\' and \'start night\'" /><br>'+
                       '<input type="button" id="compose_parallel_pipelines_on_init" value="start pipeline and on_init pipeline event start async pipeline \'slower\'"/><br>'+
                       '<input type="button" id="compose_sync_pipelines_on_init" value="start pipeline and on_init pipeline event start sync pipeline \'slower\'"/><br>');
               
               $('#start_pipeline').click(

                   function(){
                       pipes.good_morning_and_good_afternoon().apply_transformations(init_history("wake up!"));
                   });

              $('#compose_pipelines').click(function(){
                  pipes.day_and_night().apply_transformations(init_history("composing day and night"));
              });
               $('#compose_parallel_pipelines_on_init').click(function(){
                    pipes.parallel_example().apply_transformations(init_history("parallel_listener"));

               });
               $('#compose_sync_pipelines_on_init').click(function(){
                 //  apply_pipeline_with_listener_to_run_pipeline_synchronous();
                   pipes.sync_example().apply_transformations(init_history("sync_listener"));

               });

               dispatcher.listen("ON_END","pipeline_good_morning_and_noon", pipes.active_gn_button, false);

               dispatcher.listen("ON_INIT","pipeline_parallel_example",  pipes.listener_slower, true);

               dispatcher.listen("ON_INIT","pipeline_sync_example",  pipes.listener_slower, false);

               dispatcher.listen("start_night","state_step_active_gn_button", pipes.good_night, false);

               dispatcher.filter( filters.clone_data);

               dispatcher.filter( filters.profiling);

               dispatcher.filter( filters.show_profiling);


               dispatcher.filter( filters.logging);
               





               // debug_pipelines defined on index.html
               dispatcher.filter(filters.d3_debug_pipelines(history_cluster, "#pipelines",
                                                            {"mouse_event_name":"click",
                                                             fn:function(){

                                                                 var message= "BEFORE: "+toJson(this.before_data_state.history)+"\n"+"AFTER: "+toJson(this.after_data_state.history);

                                                                 $('#history').fadeOut(
                                                                     function(){

                                                                         $('#history').html("").append("<pre><code class='json'>"+message+"</code></pre>");
                                                                         $('#history').fadeIn( function(){
                                                                             setTimeout(function () {
                                                                                 $('#history').fadeOut(1500, function(){$('#history').html('');});
                                                                                   },3000);
                                                                         });
                                                                     }
                                                                     
                                                                 );
                                                             }}

                                                           ));

           }
           
           
           return init_display;

       });
