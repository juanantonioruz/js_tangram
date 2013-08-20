require.config({
    urlArgs: "bust=" + (new Date()).getTime()
});

function clean_left_status_messages(){
    $('.left_message').remove();
}

function clean_history(){
    $('#history_status').append("<hr>");

}




define(["js/common.js", "js/open_stack/events.js", "js/open_stack/filters.js", "js/pipelines/dispatcher.js", "js/pipelines/state_type.js", "js/open_stack/pipelines.js", "js/open_stack/d3_visualizations.js"
,"js/pipelines/pipeline_type.js","js/pipelines/state_step_type.js", "js/d3/history_cluster.js", "js/open_stack/model/tenant.js", "js/open_stack/model/token.js" ],
       function(common, events, filters,  dispatcher,  State, os_pipelines, d3_pipelines,  Pipeline,StateStep, history_cluster,tenant_model, token_model) {

           var data_state=State();

           data_state.host=document.location.host;

           var result=function(){
               // EOP
               dispatcher.reset();


//               dispatcher.listen_event(events.try_to_log, os_pipelines.load_tokens, false);
               dispatcher.listen_event(events.try_to_log, 
                                       function(){ return new Pipeline("her")
                                       .addPipe(os_pipelines.ttry_to_log)
                                       .addTransformation(new StateStep("ey", function(data_state, callback){
                                           console.log(common.toJson(token_model.get_model(data_state)));
                                           callback(null, data_state);
                                       }));}
                                       , false);

               dispatcher.listen_pipe("ON_END","load_tokens", os_pipelines.show_tenants, false);

//               dispatcher.listen_pipe("ON_INIT","show_tenants", os_pipelines.alerta, false);

               dispatcher.listen_event(events.tenant_selected, os_pipelines.show_tenant_operations, false);

               dispatcher.listen_event(events.operation_selected, os_pipelines.run_operation, false);

               dispatcher.listen_event(events.send_create_server, os_pipelines.create_server, false);

               dispatcher.listen_event(events.send_create_network, os_pipelines.create_network, false);

               dispatcher.listen_event(events.send_create_subnet, os_pipelines.create_subnet, false);
               

               //D3 openStack client UI
               dispatcher.listen_state_step("ON_END","model_store_tenants", d3_pipelines.d3_show_tenants,true);   
               dispatcher.listen_pipe("ON_END","load_images_flavors_networks", d3_pipelines.d3_show_images_and_flavors,true);                   
              dispatcher.listen_pipe("ON_END","load_networks", d3_pipelines.d3_show_images_and_flavors,true);                   
               


               // Filtering all transformations ::: AOP 
               dispatcher.reset_filters();
               // dispatcher.filter( filters.logging(true));
               
               // dispatcher.filter( filters.clone_data);

               // dispatcher.filter( filters.profiling);

               // dispatcher.filter( filters.show_profiling);

               dispatcher.filter(filters.d3_debug_pipelines(history_cluster, childWin, "#pipelines",
                                                            {"mouse_event_name":"contextmenu", fn:function(){
                    console.log("NS: "+this.d.ns);
                    console.log("PATH: "+this.d.path);
                    if(this.d.ns.indexOf("pipeline_")!=-1){
                        this.d.path+="/"+this.d.ns.replace("pipeline_", "").toLowerCase();
                       // alert(this.d.path);
                    }
                    if(this.path_array)                                            
                    if(this.path_array.indexOf(this.d.path)==-1){
                        
                        this.path_array.push(this.d.path);
                    }else{
                        this.path_array=this.path_array.splice(this.path_array.indexOf(this.d.path),1);
                    }
                    //console.log(this.path_array);
                    this.rerender=true;
                    d3.event.preventDefault();

                }}));


               os_pipelines.register().apply_transformations(data_state);


           };

           
           return result;

       });
