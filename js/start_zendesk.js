require.config({
    urlArgs: "bust=" + (new Date()).getTime()
});



define(["js/defines.js", "js/common.js", "js/open_stack/events.js", "js/open_stack/filters.js", "js/pipelines/dispatcher.js", "js/pipelines/state_type.js", "js/zendesk/pipelines.js", "js/open_stack/d3_visualizations.js"
        ,"js/pipelines/pipeline_type.js","js/pipelines/switcher_pipeline_type.js","js/pipelines/state_step_type.js", "js/d3/history_cluster.js", "js/open_stack/model/tenant.js", "js/open_stack/model/token.js" ,"js/zendesk/ui.js","js/zendesk/query.js", "js/open_stack/dao.js", "js/zendesk/model/user.js"],
       function(defines, common, events, filters,  dispatcher,  State, z_pipelines, d3_pipes,  Pipeline, SwitcherPipeline, StateStep, history_cluster,tenant_model, token_model, ui, query, dao, model_user) {




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
                                       defines.single_step_pipe("zendesk_welcome", ui.register_form, {ip:"enterprisewebcom.zendesk.com" , user:"juanantonioruz@gmail.com", password:"IgBNEzzUDQsJ4hSMcKWF2LYetEGeZNSNKLwi6iXp"}));

               dispatcher.listen_event(events.try_to_log, z_pipelines.try_to_log.spec);

               dispatcher.listen_pipe(events.on_end, "try_to_log",
                                      defines.single_step_pipe("show_register", ui.simple_show, {key:"profile"})
                                      .addTransformation(ui.clean_register_form).addTransformation(ui.show_links) );


               dispatcher.listen_event("show_list_organization", z_pipelines.show_organizations.spec);

               dispatcher.listen_pipe(events.on_end, "show_organizations", defines.single_step_pipe("show_orgs", ui.simple_show, {key:"organizations"}));

               dispatcher.listen_event(events.edit_model(model_user) ,  
                                       defines.single_step_pipe("editing_user_options", ui.simple_show, {key:model_user.data_state_store_selected_key})
                                       .addTransformation(query.query_load,{query:model_user.model_name, key_id_stored:model_user.data_state_store_selected_key})
                                       .addTransformation(dao.dao, {store_key:model_user.data_state_store_selected_user})

                                       .addTransformation(ui.simple_show, {key:model_user.data_state_store_selected_user})
                                       .addTransformation(ui.show_edit_user_form, {})
                                      );

               dispatcher.listen_event("send_edit_user", 
                                       defines.single_step_pipe("send_edit_user", ui.simple_show, {key:"you are editing finally the user selected"}));



               dispatcher.listen_event(events.detail_model(model_user) ,  defines.single_step_pipe("detailing_user_options", ui.simple_show, {key:model_user.data_state_store_selected_key}));

               dispatcher.listen_event("show_list_ticket",  z_pipelines.show_tickets.spec);
               dispatcher.listen_event("show_list_group",  z_pipelines.show_groups.spec);
               dispatcher.listen_event("show_list_topic",    z_pipelines.show_topics.spec);
               dispatcher.listen_event("show_list_user",     z_pipelines.show_users.spec);

               dispatcher.listen_event("create_user",  defines.single_step_pipe("user_options", ui.create_user_options));

               dispatcher.listen_event("send_create_user", 
                                       defines.single_step_pipe("user_options", ui.simple_show, {key:"create_user_options"})
                                       .addTransformation(query.query_create, {query:"user", data_key_options:"create_user_options"})
                                       .addTransformation(dao.dao));


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
