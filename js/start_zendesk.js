require.config({
    urlArgs: "bust=" + (new Date()).getTime()
});



define(["js/defines.js", "js/common.js", "js/open_stack/events.js", "js/open_stack/filters.js", "js/pipelines/dispatcher.js", "js/pipelines/state_type.js", "js/zendesk/pipelines.js", "js/open_stack/d3_visualizations.js"
        ,"js/pipelines/pipeline_type.js","js/pipelines/switcher_pipeline_type.js","js/pipelines/state_step_type.js", "js/d3/history_cluster.js", "js/open_stack/model/tenant.js", "js/open_stack/model/token.js" ,"js/zendesk/ui.js","js/zendesk/query.js", "js/open_stack/dao.js"],
       function(defines, common, events, filters,  dispatcher,  State, z_pipelines, d3_pipes,  Pipeline, SwitcherPipeline, StateStep, history_cluster,tenant_model, token_model, ui, query, dao) {




           var data_state=State();
           this.data_state=data_state;
           this.dispatcher=dispatcher;
           data_state.host=document.location.host;


           var result=function(){
               // EOP
               dispatcher.reset();

               //ON LOAD APP show register_form
//{array_state_step_functions:[], name }
               dispatcher.listen_event(events.on_load_app, 
                                       defines.single_step_pipe("show_register", ui.ui_register_form, {ip:"enterprisewebcom.zendesk.com" , user:"juanantonioruz@gmail.com", password:"IgBNEzzUDQsJ4hSMcKWF2LYetEGeZNSNKLwi6iXp"}));

               dispatcher.listen_event(events.try_to_log, 
                                       z_pipelines.try_to_log.spec
                                       , false);

               dispatcher.listen_pipe(events.on_end, "try_to_log",
                                      defines.single_step_pipe("show_register", ui.ui_simple_show, {key:"profile"}).addTransformation(ui.ui_clean_register_form).addTransformation(ui.ui_show_links), 
                                      false);


               dispatcher.listen_event("show_list_organization", 
                                      z_pipelines.show_organizations.spec, 
                                      false);

               dispatcher.listen_pipe(events.on_end, "show_organizations",
                                      defines.single_step_pipe("show_orgs", ui.ui_simple_show, {key:"organizations"}), 
                                      false);


               dispatcher.listen_event("show_list_ticket", 
                                      z_pipelines.show_tickets.spec, 
                                      false);
               dispatcher.listen_event("show_list_group", 
                                      z_pipelines.show_groups.spec, 
                                      false);
               dispatcher.listen_event("show_list_topic", 
                                      z_pipelines.show_topics.spec, 
                                      false);
               dispatcher.listen_event("show_list_user", 
                                      z_pipelines.show_users.spec, 
                                      false);

               dispatcher.listen_event("create_user", 
                                       defines.single_step_pipe("user_options", ui.ui_create_user_options), 
                                       false);
               dispatcher.listen_event("send_create_user", 
                                       defines.single_step_pipe("user_options", ui.ui_simple_show, {key:"create_user_options"}).addTransformation(query.query_create, {query:"user", data_key_options:"create_user_options"}).addTransformation(dao.dao), 
                                       false);


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
