require.config({
    urlArgs: "bust=" + (new Date()).getTime()
});


define(["js/open_stack/filters.js", "js/pipelines/dispatcher.js", "js/pipelines/state_type.js", "js/ew_related/ew_pipes.js",  "js/d3/history_cluster.js"],
       function(filters,  dispatcher,  State, pipelines,   history_cluster) {

           var data_state=State();
          

           var result=function(){

               pipelines.start()
                   .apply_transformations(data_state);

           };

           // EOP
           dispatcher.reset();

           dispatcher.listen_event("try_to_log", pipelines.load_tokens_and_select_actions, false);

           dispatcher.listen_event("action_selected", pipelines.load_action_selected, false);

           
           dispatcher.listen_state_step_in_pipe("tenant_selected","select_tenants","select_tenant_to_list_resources", 
                                                pipelines.load_endpoints_and_select_for_current_tenant, false);

           dispatcher.listen_event("endpoint_selected", pipelines.load_endpoint_selected, false);

           dispatcher.listen_event("operation_selected", pipelines.load_operation_selected, false);



           dispatcher.listen_state_step_in_pipe("tenant_selected","select_tenants","select_tenant_to_create_server",  pipelines.create_server_for_selected_tenant, false);



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
