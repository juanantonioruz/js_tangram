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


function show_message_to_the_user(the_message){

    $('#loading_results').html(the_message).css('background-color', 'aquamarine').fadeIn(500, function(){
        $('#loading_results')
            .fadeOut(2000);
    }
                                                                                        );
}




define(["js/open_stack/filters.js", "js/pipelines/dispatcher.js", "js/pipelines/state_type.js", "js/open_stack/pipelines.js", "js/open_stack/d3_visualizations.js","js/pipelines/pipeline_type.js", "js/d3/history_cluster.js"],
       function(filters,  dispatcher,  State, pipelines, d3_pipelines,  Pipeline, history_cluster) {

           var data_state=State();
           data_state.host=document.location.host;
           // this line is for d3js visualization of open_stack resources, TODO: should get out of here



           var result=function(){

               pipelines.register()
                   .apply_transformations(data_state);

           };

           // EOP
           dispatcher.reset();

           dispatcher.listen("try_to_log","pipeline_register", pipelines.load_tokens_and_select_actions, false);

           dispatcher.listen("action_selected","pipeline_load_tokens_and_select_actions", pipelines.action_choosen, false);

           dispatcher.listen("tenant_selected","pipeline_select_tenant_pipeline_for_current_user|state_step_select_tenants", pipelines.select_service_pipeline_for_current_tenant, false);

           dispatcher.listen("service_selected","state_step_select_endpoints", pipelines.operation_choosen, false);

          dispatcher.listen("operation_selected","state_step_select_available_service_operations", pipelines.load_operation, false);

           dispatcher.listen("tenant_selected","pipeline_create_server|state_step_select_tenants",  pipelines.create_server_for_selected_tenant, false);

        

           // d3js hooks, running in parallel! last parameter:true!
           dispatcher.listen("ON_INIT", "pipeline_create_server|state_step_select_tenants", d3_pipelines.d3_show_tenants,true);   


          dispatcher.listen("ON_INIT", "pipeline_create_server_for_selected_tenant|state_step_create_server_wait_for_the_name", d3_pipelines.d3_show_images_and_flavors,true);                   

           // Filtering all tansformations ::: AOP 
           dispatcher.reset_filters();


           dispatcher.filter( filters.logging);
       
           dispatcher.filter( filters.clone_data);

           dispatcher.filter( filters.profiling);

           dispatcher.filter( filters.show_profiling);

           dispatcher.filter(filters.d3_debug_pipelines(history_cluster, "#pipelines",{"mouse_event_name":"click",
                                                             fn:function(){
                                                                 console.log(this.ns);
                                                             }}));
           return result;

       });
