require.config({
    urlArgs: "bust=" + (new Date()).getTime()
});

define(["js/pipelines/json_data.js", "js/pipelines/dispatcher.js", "js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js","js/pipelines/state_type.js", "js/pipelines/helper_display.js","js/async.js"],
       function(json_data, dispatcher, Foreach_Pipeline,Pipeline, State,  display, async) {

           var timeOut=1000;

           // EOP
           dispatcher.reset();
           
           // Filtering all transformations ::: AOP 
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
           dispatcher.filter( function(data_state, callback){
               var that=this;
               setTimeout(function () {
                   if(that.transformation_event_type=="ON_END"){
                       $('#proposal').append("DONE: <b>"+that.target.ns+".</b> In Time: "+that.target.diff+"<br>");                 
                       if(data_state[that.target.ns])
                           $('#proposal').append("<span>"+toJson(data_state[that.target.ns].demo.data)+"</span><br><br>");                    
                   }
                   callback(null, data_state);
               }, 10);});

           $('body').append("<b id='fn_transformation'>starting simulation  init</b><hr><div id='proposal'></div>");
   
        return function(){
               
               var foreach_pipeline=new Foreach_Pipeline("foreach_pipeline", "the_model")
                       .addTransformation("find_display_data_transformation", 
                                          function (data_state, callback){
                                              var that=this;
                                              setTimeout(function () {
                                                  data_state["state_step_find_display_data_transformation"].demo.data="Obtaining 'display_data' value in foreach:  "+data_state.current_data.display_name;
                                                  if(!data_state.display_names){
                                                      data_state.display_names=[]; 
                                                  }
                                                  data_state.display_names.push(data_state.current_data.display_name);
                                                  callback(null, data_state);
                                              }, timeOut);
                                          })
                       .addTransformation("find_value_transformation", 
                                          function (data_state, callback){
                                              var that=this;
                                              setTimeout(function () {
                                                  data_state["state_step_find_value_transformation"].demo.data="Obtaining 'value' value in foreach:  "+data_state.current_data.value;
                                                  if(!data_state.values){
                                                      data_state.values=[]; 
                                                  }
                                                  data_state.values.push(data_state.current_data.value);
                                                  callback(null, data_state);
                                              }, timeOut);
                                          })
                       .set_on_success(
                           function(results, pipeline){
                               $('#fn_transformation').html(" fin de foreach!");
                           })
                       .set_on_error(
                           function(error, pipeline){
                               alert("error"+toJson(error));});

               var pipeline1=new Pipeline("Welcome_to_the_user")
                       .addTransformation("loading_content_please_wait", 
                                          function (data_state, callback){
                                              // only for demo display result
                                              data_state["state_step_loading_content_please_wait"].demo.data="display message to user loading content";
                                              $('#left').append("<h1 id='loading'>Loading content, please wait ...</h1>");
                                              callback(null, data_state);
                                          })
                       .addTransformation("query_server_user_dashboard", 
                                          function (data_state, callback){
                                              setTimeout(function () {
                                                  data_state.user_dashboard=json_data.user_data;
                                                  // only for demo display result
                                                  data_state["state_step_query_server_user_dashboard"].demo.data=data_state.user_dashboard;
                                                  callback(null, data_state);
                                              }, timeOut);
                                          })
                       .addTransformation("query_server_object_uri", 
                                          function (data_state, callback){
                                              setTimeout(function () {
                                                  if(data_state.user_dashboard.uuri=="/object_test")
                                                      data_state.object_data=json_data.test_objects;                                                      
                                                  // only for demo display result
                                                  data_state["state_step_query_server_object_uri"].demo.data=json_data.test_objects;
                                                  data_state.the_model=json_data.test_objects.body.resources[0].header.children;
                                                  callback(null, data_state);
                                              }, timeOut);
                                          })
                       .addPipe(foreach_pipeline)
                       .set_on_success(
                           function(results, pipeline){
                               $('#loading').fadeOut(1000, function(){
                                   $('#loading')
                                       .html('The content is already loaded!')
                                       .css('background-color', 'yellow')
                                       .fadeIn(1000, function(){
                                           $('#left').append("displays_names of body.resources[0].header.children:::<hr><ul></ul>");
                                           $.each(results.display_names, function(i, value){
                                               $('#left ul').append("<li>Display_data: "+((value)?value : "undefined value in json_data")+"</li>");
                                           });
                                           $('#left').append("values of body.resources[0].header.children:::<hr><ul></ul>");
                                           $.each(results.values, function(i, value){
                                               $('#left ul').last().append("<li>Value: "+((value)?value : "undefined value in json_data")+"</li>");
                                           });

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




           

           

       });
