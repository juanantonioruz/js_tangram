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

    $('#history_status').empty();

}

function show_dom_select(select_dom_id, the_dom_place_to_append_the_select, the_collection, the_on_change_select_fn, store_model_in_option){
    return function(){

        $(the_dom_place_to_append_the_select).append("<select id='"+select_dom_id.replace('#', '')+"'></select>");
        $.each(the_collection, function(i, value){
            var option=$("<option value='"+value.hidden+"'>"+value.visible+"</option>");
            if(store_model_in_option)
                option.data("item", value.item);
            $(select_dom_id).append(option);
        });
        $(select_dom_id).prop("selectedIndex", -1);
        $(select_dom_id).change(the_on_change_select_fn(select_dom_id));
    };
}

function show_fn_result_to_the_user_and_wait(the_message, the_function){

    $('#loading').fadeOut(1000, function(){
        $('#loading')
            .html(the_message)
            .css('background-color', 'yellow')
            .fadeIn(1000, the_function());
    }
                         );
}

define([ "js/pipelines/dispatcher.js", "js/pipelines/state_type.js", "js/pipelines/open_stack/show_user_tenants_pipeline.js","js/pipelines/open_stack/show_tenant_endpoints_pipeline.js","js/pipelines/open_stack/show_glance_images.js"],
       function(dispatcher,  State,show_user_tenants_pipeline, show_tenant_endpoints_pipeline,show_glance_images) {

           if(!document.state){
               document.state=State();
               document.state.host=document.location.host;

           }
           var result=function(){
               $('#left').append("<h1 id='loading'>openstack testing</h1>");

               $('#left').append("<div id='register_form'><h3>Login: </h3>Open Stack IP: <input type='text' id='stack_ip' value='192.168.1.22'><br> Stack User: <input type='text' id='stack_user' value='demo'><br> Password: <input type='password' id='stack_password' value='password'><br><input type='button' id='stack_logging' value='logging'></div>");

               function endpointsOnChangeSelect(dom_select_id, results ){
                   return function (){
                       var option_selected=$(dom_select_id+" option:selected").first();
                       $('#suboptions').remove();
                       var service_selected=option_selected.data("item");
                       $('#register_form').append("<div id='suboptions'><h2>Currently available for: "+service_selected.name+" </h2><select id='suboptions_available'></select></div> ");
                       if(service_selected.name=="glance"){
                           $('#suboptions_available').append("<option>LIST IMAGES</option>");
                           clean_interface();
                           results.s_host=service_selected.endpoints[0].publicURL;

                           
                           document.state=results;

                           show_glance_images
                               .set_on_success(function(results, pipeline){alert("you are watching  the  images list");}).
                               apply_transformations(document.state);
                       };


                   };
               }
               function show_tenant_endpoints_pipeline_fn(){
                   
               }

               $('#stack_logging').on('click', function(){

                   document.state.user=$('#stack_user').val();
                   document.state.password=$('#stack_password').val();
                   document.state.ip=$('#stack_ip').val();

                   clean_interface();

                   show_user_tenants_pipeline
                       .set_on_success(
                           function(results, pipeline){
                               $('#register_form').empty();

                               // --------------> NEXT PIPELINE!!!

                               show_tenant_endpoints_pipeline
                                   .set_on_success(
                                       function(results, pipeline){
                                           $('#register_form').empty();

                                           function the_on_change_select_fn(select_dom_id){
                                               return endpointsOnChangeSelect(select_dom_id, results);
                                           }



                                           show_fn_result_to_the_user_and_wait('Please select a service to use', 
                                                                               show_dom_select("#endpoints", "#register_form", results.service_catalog_select,  the_on_change_select_fn, true));

                                       })
                                   .apply_transformations(results);



                           }).apply_transformations(document.state);
               });
           };

           // EOP
           dispatcher.reset();
           
           // Filtering all tansformations ::: AOP 
           dispatcher.reset_filters();

           // filtering for timming
           dispatcher.filter( function(data_state, callback){
               var that=this;
               setTimeout(function () {
                   var history_message=that.transformation_event_type+"/"+
                           that.target.ns+((that.transformation_event_type=="ON_END")? " finished in "+that.target.diff+"ms":" ... timing ..." );
                   if(contains(history_message, "state_step_"))
                       history_message=" -------- "+history_message;
                   else if(that.transformation_event_type=="ON_END")
                       clean_left_status_messages();
                   else if(that.transformation_event_type=="ON_INIT")
                       clean_history();


                   $('#history_status').append("<li>"+history_message.replace("ON_", "")+"</li>");

                   callback(null, data_state);
               }, 10);});

           // filtering to demo display 
           // dispatcher.filter( function(data_state, callback){
           //     var that=this;
           //     setTimeout(function () {
           //         if(that.transformation_event_type=="ON_END"){
           //             $('#proposal').append("DONE: <b>"+that.target.ns+".</b> In Time: "+that.target.diff+"<br>");                 
           //             if(data_state[that.target.ns])
           //                 $('#proposal').append("<span>"+toJson(data_state[that.target.ns].demo.data)+"</span><br><br>");                    
           //         }
           //         callback(null, data_state);
           //     }, 10);});
           return result;

       });
