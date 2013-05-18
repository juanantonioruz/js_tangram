require.config({
    urlArgs: "bust=" + (new Date()).getTime()
});

define(["js/pipelines/json_data.js", "js/pipelines/dispatcher.js", "js/pipelines/pipeline_type.js","js/pipelines/state_type.js", "js/pipelines/helper_display.js","js/async.js"],
       function(json_data, dispatcher, Pipeline, State,  display, async) {
           // console.log(toJson(json_data));


           var timeOut=1000;

           var p=function(){
               $('body').append("<h1 id='fn_transformation'>starting simulation ew init</h1><div id='proposal'></div>");


               var pipeline1=new Pipeline("Welcome_to_the_user")
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


                                                  callback(null, data_state);
                                              }, timeOut);
                                          })


               ;



               pipeline1
                   .set_on_success(
                       function(results, pipeline){
                           $('#fn_transformation').html(" process ended!");
                           console.log(toJson(results));

                       })
                   .set_on_error(
                       function(error, pipeline){
                           alert("error"+toJson(error));})
                   .apply_transformations(State());



           };

           return p;

       });
