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
       function(filters,  dispatcher,  State, os_pipelines, d3_pipelines,  Pipeline, history_cluster) {

           var data_state=State();

           data_state.host=document.location.host;

           var result=function(){
 // EOP
           dispatcher.reset();

           dispatcher.listen_event("try_to_log", os_pipelines.load_tokens_and_select_tenants, false);

           dispatcher.listen_event("tenant_selected", os_pipelines.select_actions, false);
           
               dispatcher.listen_pipe("ON_INIT", "select_actions",  os_pipelines.load_endpoints_for_current_tenant, false);   
           dispatcher.listen_event("action_selected", os_pipelines.run_action_selected, false);
           
           // dispatcher.listen_state_step_in_pipe("acttttenant_selected","select_tenants","select_tenant_to_list_resources", 
           //                                      os_pipelines.load_endpoints_and_select_for_current_tenant, false);

           dispatcher.listen_event("service_selected", os_pipelines.load_endpoint_selected, false);

           dispatcher.listen_event("operation_selected", os_pipelines.load_operation_selected, false);

           dispatcher.listen_state_step_in_pipe("tenant_selected","select_tenants","select_tenant_to_create_server",  os_pipelines.create_server_for_selected_tenant, false);
           dispatcher.listen_state_step("tenant_selected","d3_show_tenants",  os_pipelines.create_server_for_selected_tenant, false);

           // d3js hooks, running in parallel! last parameter:true!
               dispatcher.listen_state_step_in_pipe("ON_INIT", "select_tenants", "select_tenant_to_create_server", d3_pipelines.d3_show_tenants,true);   
               dispatcher.listen_state_step_in_pipe("ON_INIT", "create_server_wait_for_the_name","create_server_for_selected_tenant", d3_pipelines.d3_show_images_and_flavors,true);                   

           // Filtering all tansformations ::: AOP 
           dispatcher.reset_filters();
//               dispatcher.filter( filters.logging(true));

               
 //          dispatcher.filter( filters.clone_data);

     //      dispatcher.filter( filters.profiling);

     //      dispatcher.filter( filters.show_profiling);

           dispatcher.filter(filters.d3_debug_pipelines(history_cluster, "#pipelines",{"mouse_event_name":"click",
                                                                                       fn:function(){
                                                                                           console.log(this.ns);
                                                                                       }}));
               os_pipelines.register()
                   .apply_transformations(data_state);


           };

           
           return result;

       });
