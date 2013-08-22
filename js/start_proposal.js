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
        ,"js/pipelines/pipeline_type.js","js/pipelines/switcher_pipeline_type.js","js/pipelines/state_step_type.js", "js/d3/history_cluster.js", "js/open_stack/model/tenant.js", "js/open_stack/model/token.js" ,"js/open_stack/ui.js"],
       function(common, events, filters,  dispatcher,  State, os_pipelines, d3_pipes,  Pipeline, SwitcherPipeline, StateStep, history_cluster,tenant_model, token_model, ui) {

           var data_state=State();

           data_state.host=document.location.host;

           var load_operation=os_pipelines.load_operation;
           os_pipelines=os_pipelines.pipes;

           var result=function(){
               // EOP
               dispatcher.reset();

               dispatcher.listen_event(events.try_to_log, 
                                       function(){
                                           return new Pipeline("try_log")
                                               .addTransformation(os_pipelines.load_tokens)
                                               .addTransformation(new SwitcherPipeline("",
                                                                                       function(value){
                                                                                           if(value){
                                                                                               return new Pipeline("register_ok")
                                                                                                   .addTransformation(ui.ui_empty_register_form)
                                                                                                   .addTransformation(os_pipelines.load_tenants)
                                                                                                   .addTransformation(ui.ui_select_tenants)
                                                                                               ;
                                                                                           }else{
                                                                                               return os_pipelines.alerta();
                                                                                           }
                                                                                       },
                                                                                       token_model.data_state_key,
                                                                                       function(value){ return (value)? "loaded" : "INVALID";}));
                                           ;

                                       }
                                       , false);

               //example on_init and on_load listening events
               dispatcher.listen_pipe("ON_INIT","load_tokens", os_pipelines.alerta, false);
               dispatcher.listen_pipe("ON_END","load_tokens", os_pipelines.alerta, false);


               dispatcher.listen_event(events.tenant_selected, function(){return new Pipeline("tenant_selected")
                                                                          .addTransformation(os_pipelines.load_tenant_selected)
                                                                          .addTransformation(ui.ui_select_operations);
                                                                         }, false);

               dispatcher.listen_event(events.operation_selected, os_pipelines.operation_selected, false);

               dispatcher.listen_event(events.send_create_server, os_pipelines.create_server, false);

               dispatcher.listen_event(events.send_create_network, os_pipelines.create_network, false);

               dispatcher.listen_event(events.send_create_subnet, os_pipelines.create_subnet, false);
               

               //D3 openStack client UI
               dispatcher.listen_state_step("ON_END","model_store_tenants", d3_pipes.d3_show_tenants,false);   
               
               dispatcher.listen_pipe("ON_END","listing_servers", d3_pipes.d3_show_servers,false);   
               
               dispatcher.listen_pipe("ON_END","tenant_selected", function(){ 
                   return new Pipeline("d3_update")
                       .addPipe(load_operation("list","servers"))
                       .addPipe(load_operation("list","images"))
                       .addPipe(load_operation("list","flavors"))
                       .addPipe(load_operation("list","networks"))
                       .addTransformation(d3_pipes.d3_show_tenants)
                       .addTransformation(d3_pipes.d3_show_servers)
                       .addTransformation(d3_pipes.d3_show_images)
                       .addTransformation(d3_pipes.d3_show_flavors)
                       .addTransformation(d3_pipes.d3_show_networks)
                       .addTransformation(os_pipelines.alerta)
                   ;
               },false);   

               dispatcher.listen_pipe("ON_END","create_server", function(){ 
                   return new Pipeline("d3_create_server")
                       .addTransformation(d3_pipes.d3_show_tenants)
                       .addPipe(load_operation("list","servers"))
                       .addTransformation(d3_pipes.d3_show_servers)

                   ;
               },false);   

               dispatcher.listen_pipe("ON_END","create_subnet", function(){ 
                   return new Pipeline("d3_create_subnet")
                       .addTransformation(d3_pipes.d3_show_tenants)
                       .addTransformation(d3_pipes.d3_show_networks)

                   ;
               },false);   

               


               // Filtering all transformations ::: AOP 
               dispatcher.reset_filters();
//               dispatcher.filter( filters.logging(true));
               
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
