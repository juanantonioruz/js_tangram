require.config({
    urlArgs: "bust=" + (new Date()).getTime()
});

define(["js/pipelines/json_data.js", "js/pipelines/dispatcher.js", "js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js","js/pipelines/state_type.js", "js/pipelines/helper_display.js","js/async.js"],
       function(json_data, dispatcher, Foreach_Pipeline,Pipeline, State,  display, async) {

           var timeOut=1000;

           

           var p=function(){
               
               $('body').append("<b id='fn_transformation'>starting simulation  init</b><hr><div id='proposal'></div>");

               
                var foreach_pipeline=new Foreach_Pipeline("Welcome_to_the_foreach", "the_model")
                       .addTransformation("foreach_transformation", 
                                          function (data_state, callback){
                                              var that=this;

                                              setTimeout(function () {
                                                  // only for demo display result
                                                 // var my_data=data_state["state_step_query_server_object_uri"].demo.data;

                                                 // my_data=my_data.body.resources[0];
                                                  var my_data={display_name:"example"};
                                                  
                                             //     var data_model=my_data.header[this.model_key];
                                                  data_state["state_step_foreach_transformation"].demo.data="inside for each: display_name:  "+data_state.current_data.display_name;

                                                  callback(null, data_state);
                                              }, timeOut);
                                          }).set_on_success(
                       function(results, pipeline){
                           $('#fn_transformation').html(" fin de foreach!");
                           console.log(toJson(results));

                       })
                   .set_on_error(
                       function(error, pipeline){
                           alert("error"+toJson(error));});


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
                                                  data_state.the_model=json_data.test_objects.body.resources[0].header.children;
                                                  callback(null, data_state);
                                              }, timeOut);
                                          })
                .addPipe(foreach_pipeline)
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

           // EOP
           dispatcher.reset();
// here i can hear the on_end event, so the collection on json data is loaded
// now i need to iterate over this collectino and run pipelines in relation to each data type loaded

//maybe i need a  next function to call itself if still  there are elements availables
//           dispatcher.listen("ON_END","state_step_query_server_object_uri",  show_child, false);
 //          dispatcher.listen("ON_END","state_step_loading_child_template",  show_child, false);
           



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


           return p;

       });
