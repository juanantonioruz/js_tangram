require.config({
    urlArgs: "bust=" + (new Date()).getTime()
});
function clean_interface(){
    $('#content').empty();
    $('#history_status').empty();

};

define([ "js/pipelines/dispatcher.js", "js/pipelines/open_stack/show_user_tenants_pipeline.js","js/pipelines/state_type.js"],
       function(dispatcher, show_user_tenants_pipeline, State) {

           if(!document.state){
               document.state=State();
               document.state.host=document.location.host;

           }
           var result=function(){
               $('#left').append("<h1 id='loading'>openstack testing</h1>");

               $('#left').append("<div id='register_form'><h3>Login: </h3>Open Stack IP: <input type='text' id='stack_ip' value='192.168.1.22'><br> Stack User: <input type='text' id='stack_user' value='demo'><br> Password: <input type='password' id='stack_password' value='password'><br><input type='button' id='stack_logging' value='logging'></div>");

               $('#stack_logging').on('click', function(){

                   document.state.user=$('#stack_user').val();
                   document.state.password=$('#stack_password').val();
                   document.state.ip=$('#stack_ip').val();
                   $('#left').append("<b id='fn_transformation'>starting simulation  init</b><hr><div id='proposal'></div>");
                   clean_interface();

                   show_user_tenants_pipeline
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
                       .apply_transformations(document.state);
               });



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

           return result;

       });
