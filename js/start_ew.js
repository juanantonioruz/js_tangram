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

               // dispatcher.listen_state_step("ON_END", "body_change_state", pipelines.render_mapper,  false);
               // dispatcher.listen_state_step("ON_END", "body_change_state", t.state_history.save_to_cookie,  false);

               // dispatcher.listen_state_step("ON_END", "body_change_state", t.transformations.footer_update_breadcrumbs,  false);

               dispatcher.listen_state_step("ON_INIT", "render_page_body",  t.cache_data.page_body, false);
               
               dispatcher.listen_state_step("ON_INIT", "dao_load_pages_main_data",  t.update.loading_object_editor, false);
               dispatcher.listen_state_step("ON_END", "dao_load_pages_main_data",  t.renders.trays, false);





               // this transformations have  been moved to the related pipelines
               //   dispatcher.listen_state_step("ON_END", "render_page_body",  render_pipes.page_body_page_type, false);               // dispatcher.listen_state_step("ON_INIT", "render_pages_main",  t.renders.activity_list, false);


               // Filtering all tansformations ::: AOP 
               dispatcher.reset_filters();

               //TODO investigate why throw error when the app increase complexity   --> too much recursion --> sync process         
               dispatcher.filter( filters.logging(true));
               
               // dispatcher.filter( filters.clone_data);

               
               dispatcher.filter( filters.profiling);

               
               dispatcher.filter( filters.show_profiling(true));

               dispatcher.filter(filters.d3_debug_pipelines(history_cluster, "#pipelines",{"mouse_event_name":"click",
                                                                                           fn:function(){
                                                                                               console.log(this.ns);
                                                                                           }}));
               console.log("INIT******************************** TTTT");
               pipelines.init().set_on_success(function(result, pipeline){
                   console.log("END********************************  TTTT");                       

               })
                   .apply_transformations(data_state);

           };

           
           return result;

       });
