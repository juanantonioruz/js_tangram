require.config({
    urlArgs: "bust=" + (new Date()).getTime()
});
function clean_interface(){
    $('#content').empty();


};

function clean_left_status_messages(){
    $('.left_message').remove();

}

function clean_history(){

    $('#history_status').append("<hr>");

}

function show_dom_select(select_dom_id, the_dom_place_to_append_the_select, the_collection, the_on_change_select_fn, store_model_in_option){

    return function(){
    $(select_dom_id).remove();
        $(the_dom_place_to_append_the_select).append("<select id='"+select_dom_id.replace('#', '')+"'></select>");
        $.each(the_collection, function(i, value){
            var option=$("<option value='"+value.hidden+"'>"+value.visible+"</option>");
            if(store_model_in_option)
                option.data("item", value.item);
            $(select_dom_id).append(option);
        });
        $(select_dom_id).prop("selectedIndex", -1);
        $(select_dom_id).change(the_on_change_select_fn(select_dom_id));
    };
}

function show_fn_result_to_the_user_and_wait(the_message, the_function){

    $('#loading').fadeOut(1000, function(){
        $('#loading')
            .html(the_message)
            .css('background-color', 'yellow')
            .fadeIn(1000, the_function());
    }
                         );
}

function show_message_to_the_user(the_message){

    $('#loading_results').html(the_message).css('background-color', 'aquamarine').fadeIn(500, function(){
        $('#loading_results')
            .fadeOut(2000);
    }
                         );
}



define([ "js/pipelines/dispatcher.js", "js/pipelines/state_type.js", "js/pipelines/open_stack/show_user_tenants_pipeline.js","js/pipelines/open_stack/show_tenant_endpoints_pipeline.js","js/pipelines/open_stack/show_glance_images.js"],
       function(dispatcher,  State,pipelines, show_tenant_endpoints_pipeline,show_glance_images) {

           if(!document.state){
               document.state=State();
               document.state.host=document.location.host;

           }
           var result=function(){


               $('#left').append("<div id='register_form'><h3>Login: </h3>Open Stack IP: <input type='text' id='stack_ip' value='192.168.1.22'><br> Stack User: <input type='text' id='stack_user' value='demo'><br> Password: <input type='password' id='stack_password' value='password'><br><input type='button' id='stack_logging' value='logging'></div>");

              

               $('#stack_logging').on('click', function(){

                   document.state.user=$('#stack_user').val();
                   document.state.password=$('#stack_password').val();
                   document.state.ip=$('#stack_ip').val();

                   clean_interface();

                   pipelines.show_users
                   .apply_transformations(document.state);
               });
           };

           // EOP
           dispatcher.reset();

           dispatcher.listen("ON_END", "pipeline_select_tenant_pipeline_for_current_user", pipelines.show_services,false);

           dispatcher.listen("ON_END", "pipeline_select_service_pipeline_for_current_tenant", pipelines.show_operations,false);

           dispatcher.listen("ON_END", "pipeline_show_available_operations", pipelines.load_operation,false);           


           // Filtering all tansformations ::: AOP 
           dispatcher.reset_filters();

           // filtering for timming
           dispatcher.filter( function(data_state, callback){
               var that=this;
               setTimeout(function () {
                   var history_message=that.transformation_event_type+"/"+
                           that.target.ns+((that.transformation_event_type=="ON_END")? " finished in "+that.target.diff+"ms":" ... timing ..." );
                   if(contains(history_message, "state_step_")){
                       history_message=" -------- "+history_message;
                        if(that.transformation_event_type=="ON_END")
                            $('.left_message').last().fadeOut(1000);
                   }
                   else if(that.transformation_event_type=="ON_INIT")
                       clean_history();


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
