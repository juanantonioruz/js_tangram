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
                           });
               });
           };


           return result;

       });
