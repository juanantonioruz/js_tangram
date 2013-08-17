require.config({
    urlArgs: "bust=" + (new Date()).getTime()
});
function clean_interface(){
    $('#content').empty();
};

function clean_left_status_messages(){
    $('.left_message').remove();
}

function clean_history(){
    $('#history_status').append("<hr>");

}


function show_message_to_the_user(the_message){

    $('#loading_results').html(the_message).css('background-color', 'aquamarine').fadeIn(500, function(){
        $('#loading_results')
            .fadeOut(2000);
    }
                                                                                        );
}


define(["js/open_stack/filters.js", "js/pipelines/dispatcher.js", "js/pipelines/state_type.js", "js/open_stack/pipelines.js", "js/open_stack/d3_visualizations.js","js/pipelines/pipeline_type.js", "js/d3/history_cluster.js"],
       function(filters,  dispatcher,  State, os_pipelines, d3_pipelines,  Pipeline, history_cluster) {

           var data_state=State();

           data_state.host=document.location.host;

           var result=function(){
               // EOP
               dispatcher.reset();

               dispatcher.listen_event("try_to_log", os_pipelines.show_tenants, false);

               dispatcher.listen_event("tenant_selected", os_pipelines.show_actions, false);

               dispatcher.listen_event("action_selected", os_pipelines.run_action, false);

               dispatcher.listen_event("send_create_server", os_pipelines.create_server, false);

               dispatcher.listen_event("send_create_network", os_pipelines.create_network, false);

               dispatcher.listen_event("send_create_subnet", os_pipelines.create_subnet, false);
               

               //D3 openStack client UI
               dispatcher.listen_state_step("ON_END","store_tenants", d3_pipelines.d3_show_tenants,true);   
               dispatcher.listen_pipe("ON_END","load_images_flavors_networks", d3_pipelines.d3_show_images_and_flavors,true);                   
               dispatcher.listen_pipe("ON_END","load_networks", d3_pipelines.d3_show_images_and_flavors,true);                   


               // Filtering all transformations ::: AOP 
               dispatcher.reset_filters();
               //               dispatcher.filter( filters.logging(true));

               
               //          dispatcher.filter( filters.clone_data);

               //      dispatcher.filter( filters.profiling);

               //      dispatcher.filter( filters.show_profiling);

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
