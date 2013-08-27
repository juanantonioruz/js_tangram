require.config({
    urlArgs: "bust=" + (new Date()).getTime()
});

function clean_left_status_messages(){
    $('.left_message').remove();
}

function clean_history(){
    $('#history_status').append("<hr>");

}


define(["js/defines.js", "js/common.js", "js/open_stack/events.js", "js/open_stack/filters.js", "js/pipelines/dispatcher.js", "js/pipelines/state_type.js", "js/open_stack/pipelines.js", "js/open_stack/d3_visualizations.js"
        ,"js/pipelines/pipeline_type.js","js/pipelines/switcher_pipeline_type.js","js/pipelines/state_step_type.js", "js/d3/history_cluster.js", "js/open_stack/model/tenant.js", "js/open_stack/model/token.js" ,"js/open_stack/ui.js"],
       function(defines, common, events, filters,  dispatcher,  State, os_pipelines, d3_pipes,  Pipeline, SwitcherPipeline, StateStep, history_cluster,tenant_model, token_model, ui) {




           var data_state=State();
           this.data_state=data_state;
           this.dispatcher=dispatcher;
           data_state.host=document.location.host;

           var load_operation=os_pipelines.load_operation;


           var result=function(){
               // EOP
               dispatcher.reset();

               //ON LOAD APP show register_form
//{array_state_step_functions:[], name }
               dispatcher.listen_event(events.on_load_app, 
                                       defines.single_step_pipe("hola", ui.ui_register_form, {runtime:"value added in instantiation time binding"}));




//               var load_tenants= define_pipe(os_pipelines.yuhu.spec);


                 var ok_register_example_not_in_use=defines.pipeline(
                     {array_state_step_functions:
                      [ui.ui_empty_register_form], 
                      name:"simple_test"});
               




               dispatcher.listen_event(events.try_to_log, 
                                       defines.single_step_pipe("setting",  ui.ui_set_value,{set_value_key:"ey", set_value_value:"hola"})
                                        .addTransformation(ui.ui_show_data_state_value, {data_state_key:"ey"})
                                       .addTransformation(os_pipelines.load_tokens.spec)
                                        .addTransformation(
                                            defines.switcher(token_model.data_state_key,
                                                             defines.single_step_pipe(null,ui.ui_alerta, {show:"positivecase"} ).addTransformation(ok_register_example_not_in_use), //defines.pipe(os_pipelines.ok_register.spec), 
                                                             defines.single_step_pipe(null,ui.ui_alerta, {show:"negative case"} )))
                                       //.addTransformation(ok_register_example_not_in_use)
                                      
                                       ,false);






               // dispatcher.listen_event(events.tenant_selected, 
               //                         defines.pipe(os_pipelines.load_tenant_selected.spec)
               //                         .addTransformation(defines.state_step(ui.ui_select_operations,{show:"juan", juan:"work"}))

               //                        ,false);


               //  dispatcher.listen_event(events.operation_selected,                                       
               //                          defines.pipe(os_pipelines.operation_selected.spec)
               //                          , false);

               /*




                dispatcher.listen_event(events.send_create_server, os_pipelines.send_create_server, false);

                dispatcher.listen_event(events.send_create_network, os_pipelines.create_network, false);

                dispatcher.listen_event(events.send_create_subnet, os_pipelines.create_subnet, false);
                


                //example on_init and on_load listening events
                dispatcher.listen_pipe(events.on_init,"load_tokens", os_pipelines.alerta, false);
                dispatcher.listen_pipe(events.on_end,"load_tokens", os_pipelines.alerta, false);


                //D3 openStack client UI
                dispatcher.listen_state_step(events.on_end,"model_store_tenants", d3_pipes.d3_show_tenants,true);   
                
                dispatcher.listen_pipe(events.on_end,"listing_servers", d3_pipes.d3_show_servers,true);   
                
                dispatcher.listen_pipe(events.on_end,"tenant_selected", function(){ 
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
                },true);   

                dispatcher.listen_pipe(events.on_end,"send_create_server", function(){ 
                return new Pipeline("d3_create_server")
                .addTransformation(d3_pipes.d3_show_tenants)
                .addPipe(load_operation("list","servers"))
                .addTransformation(d3_pipes.d3_show_servers)

                ;
                },true);   

                dispatcher.listen_pipe(events.on_end,"create_subnet", function(){ 
                return new Pipeline("d3_create_subnet")
                .addTransformation(d3_pipes.d3_show_tenants)
                .addTransformation(d3_pipes.d3_show_networks)

                ;
                },true);   

                */


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
               var start_pipe=new Pipeline("start");
               this.start_pipe=start_pipe;
               dispatcher.dispatch(events.on_load_app, start_pipe, data_state);

           };

           
           return result;

       });
