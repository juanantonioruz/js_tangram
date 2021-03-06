require.config({
    urlArgs: "bust=" + (new Date()).getTime()
});
define(["js/defines.js", "js/common.js", "js/open_stack/events.js", "js/open_stack/filters.js", "js/pipelines/dispatcher.js", "js/pipelines/state_type.js", "js/zendesk/pipelines.js", "js/open_stack/d3_visualizations.js"
   ,"js/pipelines/pipeline_type.js"    , "js/d3/history_cluster.js", "js/zendesk/ui.js","js/zendesk/query.js", "js/dao/dao"+this.debug_value+".js","js/zendesk/model.js",
        "js/zendesk/model/user.js","js/zendesk/model/organization.js","js/zendesk/model/ticket.js", "js/zendesk/helper"+this.debug_value+".js"],

       function(defines, common, events, filters,  dispatcher,  State, z_pipelines, d3_pipes,   
                Pipeline, history_cluster, ui, query, dao,_model, 
                user_model, org_model, ticket_model, helper) {

           
           var result=function(){

           var data_state;
//           console.dir(this.data_state);

           if(this.stock){
              //  console.log("this.data_state exists");
              // console.dir(this.stock);
               data_state=this.stock;
           }else{
           //    console.log("this.data_state NO exists");
               data_state=State();

            
           }

               // debug purposes
           this.data_state=data_state;


           data_state.host=document.location.host;




               // EOP
               dispatcher.reset();


               dispatcher.listen_event(events.on_load_app, 
                                       defines.single_step_pipe("zendesk_welcome", ui.register_form, 
                                                                {ip:"enterprisewebcom.zendesk.com" , user:"juanantonioruz@gmail.com", password:"IgBNEzzUDQsJ4hSMcKWF2LYetEGeZNSNKLwi6iXp"})
                                       .addTransformation(helper.ey)
);


               dispatcher.listen_event(events.try_to_log, z_pipelines.try_to_log.spec);

               dispatcher.listen_pipe(events.on_end, "try_to_log",
                                      defines.single_step_pipe("show_register", ui.simple_show, {key:"profile"})
                                      .addTransformation(ui.clean_register_form).addTransformation(ui.show_links) );


               dispatcher.listen_event("ey",  defines.single_step_pipe("show_ey", ui.simple_show, {key:"juan"}));

               dispatcher.listen_state_step("ON_END", "ui_show_edit_user_form",  
                                            defines.single_step_pipe("show_select_orgssss", query.query_base, {"query":"organizations"} )
                                            .addTransformation(dao.dao)
                                            .addTransformation(_model.model_load_base, {key:"organizations", dao_key:"organizations"})
                                            .addTransformation(ui.show_select_orgs, {"no_buttons":true, target_dom_id:"#fields" }));
                   

               dispatcher.listen_pipe(events.on_end, "show_organizations", defines.single_step_pipe("show_orgs", ui.simple_show, {key:"organizations"}));

               var mapa={"user":user_model, "organization":org_model, "ticket":ticket_model};

               ["user", "organization", "ticket"].map(function(model_name){
                   var model=mapa[model_name];
               dispatcher.listen_event(events.edit_model(model) ,  
                                       defines.single_step_pipe("editing_"+model_name+"_options", ui.simple_show, {key:model.data_state_store_selected_key})
                                       .addTransformation(query.query_load,{query:model.model_name, key_id_stored:model.data_state_store_selected_key})
                                       .addTransformation(dao.dao, {store_key:model.data_state_store_selected_object})

                                       .addTransformation(ui.simple_show, {key:model.data_state_store_selected_object})
                                       .addTransformation(ui["show_edit_"+model_name+"_form"], {})
                                      );
               dispatcher.listen_event(events.detail_model(model) ,  defines.single_step_pipe("detailing_user_options", ui.simple_show, {key:model.data_state_store_selected_key}));
               });

               dispatcher.listen_event("send_edit_user", 
                                       defines.single_step_pipe("send_edit_user", ui.simple_show, {key:user_model.data_state_store_user_on_editing})
                                       .addTransformation(query.query_update,{query:user_model.model_name, data_key_options:user_model.data_state_store_user_on_editing,key_id_stored:user_model.data_state_store_selected_key})
                                       .addTransformation(dao.dao)
                                       .addTransformation(ui.simple_show, {key:"successful editing!!"})
);





               dispatcher.listen_event("show_list_ticket",  z_pipelines.show_tickets.spec);
               dispatcher.listen_event("show_list_group",  z_pipelines.show_groups.spec);
               dispatcher.listen_event("show_list_topic",    z_pipelines.show_topics.spec);
               dispatcher.listen_event("show_list_user",     z_pipelines.show_users.spec);
               dispatcher.listen_event("show_list_organization", z_pipelines.show_organizations.spec);
               dispatcher.listen_event("create_user",  defines.single_step_pipe("user_options", ui.create_user_options));

               dispatcher.listen_event("send_create_user", 
                                       defines.single_step_pipe("user_options", ui.simple_show, {key:"create_user_options"})
                                       .addTransformation(query.query_create, {query:"user", data_key_options:"create_user_options"})
                                       .addTransformation(dao.dao));

              // dispatcher.filter( filters.logging(true, true));
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


              // dispatcher.dispatch(events.on_load_app, start_pipe, data_state);



               this.dispatch=function(event_name, init_app, clean){
                   if(init_app) this.init(clean);
//                   console.dir(data_state.password);
 //                  console.dir(data_state.last_event_dispatched);

                   dispatcher.dispatch(event_name, start_pipe, data_state);
               };



               if(data_state.last_event_dispatched){
                   console.dir(data_state.password);
                   console.dir(data_state.last_event_dispatched);
                   this.dispatch(data_state.last_event_dispatched);
               }


           };

           
           return result;

       });
