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

           dispatcher.listen("try_to_log","pipeline_register", pipelines.load_tokens, false);

           dispatcher.listen("action_selected","pipeline_load_tokens_and_select_actions", pipelines.mapper_action_choosen, false);

           dispatcher.listen("tenant_selected","state_step_show_select_tenant", pipelines.show_services, false);

           dispatcher.listen("service_selected","state_step_show_select_endpoints", pipelines.show_operations, false);

          dispatcher.listen("operation_selected","state_step_select_available_service_operations", pipelines.load_operation, false);

           dispatcher.listen("tenant_selected","state_step_create_server_show_select_tenants",  pipelines.create_server_for_selected_tenant, false);





           // d3js hooks, running in parallel! last parameter:true!
           dispatcher.listen("ON_INIT", "state_step_create_server_show_select_tenants", d3_pipelines.d3_show_tenants,true);   

           dispatcher.listen("tenant_selected", "state_step_create_server_show_select_tenants", d3_pipelines.d3_show_tenant_data ,false);   



           dispatcher.listen("ON_INIT", "state_step_create_server_wait_for_the_name", d3_pipelines.d3_show_images_and_flavors,true);                   

           // Filtering all tansformations ::: AOP 
           dispatcher.reset_filters();

           // filtering for timming



               dispatcher.filter( filters.logging);
       
           dispatcher.filter( filters.clone_data);

           dispatcher.filter( filters.profiling);

           dispatcher.filter( filters.show_profiling);

           dispatcher.filter(filters.d3_debug_pipelines(history_cluster, "#pipelines"));
           return result;

       });
