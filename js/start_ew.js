require.config({
    urlArgs: "bust=" + (new Date()).getTime()
});


define(["js/open_stack/filters.js", "js/pipelines/dispatcher.js", "js/pipelines/state_type.js", "js/ew_related/ew_pipes.js", "js/ew_related/ew_render_pipes.js", "js/ew_related/transformations.js",  "js/d3/history_cluster.js"],
       function(filters,  dispatcher,  State, pipelines,render_pipes, t,  history_cluster) {

           var data_state=State();
           

           var result=function(){
               // EOP
               dispatcher.reset();

               dispatcher.listen_event("body_change_state", pipelines.body_change_state, true);
//               dispatcher.listen_event("body_change_state_bis",t.transformations.alerta, true);
               dispatcher.listen_event("show_profile", pipelines.show_profile, true);
               dispatcher.listen_event("show_history", pipelines.render_modal_your_history, true);
               dispatcher.listen_event("clear_history", pipelines.clear_history, true);
               dispatcher.listen_event("window_reload", t.transformations.window_location_reload, true);               


               dispatcher.listen_event("update_object_viewer", pipelines.update_object_viewer, true);





               // Filtering all tansformations ::: AOP 
               dispatcher.reset_filters();

               //TODO investigate why throw error when the app increase complexity   --> too much recursion --> sync process         
//               dispatcher.filter( filters.logging(true));
               
               // dispatcher.filter( filters.clone_data);

               
//               dispatcher.filter( filters.profiling);

               
 //              dispatcher.filter( filters.show_profiling(true));

                dispatcher.filter(filters.d3_debug_pipelines(history_cluster, "#pipelines",{"mouse_event_name":"contextmenu", fn:function(){
                    console.log("NS: "+this.d.ns);
                    console.log("PATH: "+this.d.path);
                    if(this.d.ns.indexOf("pipeline_")!=-1){
                        this.d.path+="/"+this.d.ns.replace("pipeline_", "").toLowerCase();
                       // alert(this.d.path);
                    }
                    if(this.path_array.indexOf(this.d.path)==-1){
                        
                        this.path_array.push(this.d.path);
                    }else{
                        this.path_array=this.path_array.splice(this.path_array.indexOf(this.d.path),1);
                    }
                    //console.log(this.path_array);
                    this.rerender=true;
                    d3.event.preventDefault();

                }}, 
                                                             [
 // "/root/event..body_change_state/body_change_state/state..?object_view/render_page_body/page_type..?object/render_pages_main/render_object_viewer/render_body_children/$..0/render_object_object/has_children..?collection/walk_children/$..0",""
                                                                 //               "/root/init"
                                                                 //       ,       "/root/EVENT..BODY_CHANGE_STATE/BODY_CHANGE_STATE"
                                                             ]));
               console.log("INIT******************************** TTTT");
               pipelines.init().set_on_success(function(result, pipeline){
                   // setInterval(function(){
                   //     pipelines.current_state_is_still_active().apply_transformations(data_state);
                   //  }, 30000);
                   console.log("END********************************  TTTT");                       

               })
                   .apply_transformations(data_state);

           };

           
           return result;

       });





               /*/ THIS LINES have been moved to pipelines to increment meaning domain
               dispatcher.listen_state_step("ON_END", "body_change_state", pipelines.render_mapper,  false);
               dispatcher.listen_state_step("ON_END", "body_change_state", t.state_history.save_to_cookie,  false);

                dispatcher.listen_state_step("ON_END", "body_change_state", t.transformations.footer_update_breadcrumbs,  false);

               dispatcher.listen_pipe("ON_INIT", "render_page_body",  t.cache_data.page_body, true);
               dispatcher.listen_state_step("ON_INIT", "dao_load_pages_main_data",  t.update.loading_object_editor, false);
   dispatcher.listen_state_step("ON_END", "dao_load_pages_main_data",  t.renders.trays, false);
 */
              
            





               // this transformations have  been moved to the related pipelines
               //   dispatcher.listen_state_step("ON_END", "render_page_body",  render_pipes.page_body_page_type, false);               // dispatcher.listen_state_step("ON_INIT", "render_pages_main",  t.renders.activity_list, false);

