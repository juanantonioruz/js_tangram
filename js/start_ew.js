require.config({
    urlArgs: "bust=" + (new Date()).getTime()
});


define(["js/open_stack/filters.js", "js/pipelines/dispatcher.js", "js/pipelines/state_type.js", "js/ew_related/ew_pipes.js", "js/ew_related/ew_render_pipes.js", "js/ew_related/transformations.js",  "js/d3/history_cluster.js"],
       function(filters,  dispatcher,  State, pipelines,render_pipes, t,  history_cluster) {

           var data_state=State();
           

           var result=function(){
               // EOP
               dispatcher.reset();

               dispatcher.listen_state_step("ON_INIT", "body_change_state",  t.transformations.close_modals, false);
               dispatcher.listen_state_step("ON_INIT", "body_change_state",  t.transformations.prepare_state_history_to_cookie, false);

               dispatcher.listen_state_step("ON_END", "body_change_state", pipelines.render_mapper,  false);
               dispatcher.listen_state_step("ON_END", "body_change_state", t.transformations.save_state_history_to_cookie,  false);

               dispatcher.listen_state_step("ON_END", "body_change_state", t.transformations.footer_update_breadcrumbs,  false);


               dispatcher.listen_state_step("ON_INIT", "render_page_body",  t.cache_data.page_body, false);



               // this transformations have  been moved to the related pipelines
            //   dispatcher.listen_state_step("ON_END", "render_page_body",  render_pipes.page_body_page_type, false);               // dispatcher.listen_state_step("ON_INIT", "render_pages_main",  t.renders.activity_list, false);


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
               pipelines.init()
                   .apply_transformations(data_state);

           };

           
           return result;

       });
