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

function show_dom_select(select_dom_id, the_dom_place_to_append_the_select, the_collection, the_on_change_select_fn, store_model_in_option){

    return function(){
        $(select_dom_id).remove();
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

function show_message_to_the_user(the_message){

    $('#loading_results').html(the_message).css('background-color', 'aquamarine').fadeIn(500, function(){
        $('#loading_results')
            .fadeOut(2000);
    }
                                                                                        );
}



define([ "js/pipelines/dispatcher.js", "js/pipelines/state_type.js", "js/pipelines/open_stack/show_user_tenants_pipeline.js","js/pipelines/pipeline_type.js"],
       function(dispatcher,  State, pipelines, Pipeline) {

           var data_state=State();
           data_state.host=document.location.host;


           var result=function(){

               var pipeline4=new Pipeline("register")
                       .addTransformation("show_register_form", 
                                          function (data_state, callback){
                                              $('#right').prepend("<h3 class='left_message'>show_register_form,  ...</h3>");
                                              $('#left').append("<div id='register_form'><h3>Login: </h3>Open Stack IP: <input type='text' id='stack_ip' value='192.168.1.22'><br> Stack User: <input type='text' id='stack_user' value='demo'><br> Password: <input type='password' id='stack_password' value='password'><br><input type='button' id='stack_logging' value='logging'></div>");

                                              
                                              $('#stack_logging').on('click', function(){

                                                  data_state.user=$('#stack_user').val();
                                                  data_state.password=$('#stack_password').val();
                                                  data_state.ip=$('#stack_ip').val();
                                                  callback(null, data_state);
                                              });

                                          })
                       .addTransformation("loading_tokens_please_wait", 
                                          function (data_state, callback){
                                              $('#right').prepend("<h3 class='left_message'>Loading token, please wait ...</h3>");
                                              $.ajax({
                                                  type: "POST",
                                                  url: "http://"+data_state.host+"/tokens",
                                                  data:{s_user:data_state.user, s_pw:data_state.password, s_ip:data_state.ip}
                                              }).done(function( msg ) {
                                                  if(!msg.error){

                                                      data_state.token_id=msg.access.token.id;
                                                      $('#content').prepend( "<h2>Token Loaded</h2><pre><code class='json'>"+toJson(msg)+"</code></pre>" );
                                             
                                                      $('#register_form').fadeOut(500).empty().fadeIn();
                                                      show_fn_result_to_the_user_and_wait("you are logged now!, please select an option: ", 
                                                      function(){
                                                          
                                                          $('#register_form').append("<div id='actions_available'><h2> actions available</h2></div>").fadeIn(100, function(){
                                                              show_dom_select("#init_filter", "#actions_available", [{visible:"create server", hidden:"create_server"}, {visible:"listing resources", hidden:"listing_resources"}], 
                                                                              function(select_dom_id){ 
                                                                                  return function(){
                                                                                      var selected=$(select_dom_id+" option:selected").first().val();
                                                                                      data_state.action_selected=selected;
                                                                                      show_message_to_the_user("action selected: "+selected);
                                                                                      $('#actions_available').fadeOut();
                                                                                      callback(null, data_state);
                                                                                  };
                                                                              })();
                                                          });

                                                      });
                                                      
                                                  }else{
                                                      $('#content').prepend( "<h2>There is a problem with your account, try again please</h2>" );                                                  
                                                      callback(msg.error, data_state);
                                                  }
                                              });
                                              
                                          })
                       .set_on_success(function(results, pipeline){
                           if(results.action_selected=="listing_resources"){
                               clean_interface();
                               pipelines.show_users
                                   .apply_transformations(results);
                               }else{
                                   pipelines.create_server
                                   .apply_transformations(results);
                               }
                       })

                       .apply_transformations(data_state);



               

               
           };

           // EOP
           dispatcher.reset();

           dispatcher.listen("ON_END", "pipeline_select_tenant_pipeline_for_current_user", pipelines.show_services,false);

           dispatcher.listen("ON_END", "pipeline_select_service_pipeline_for_current_tenant", pipelines.show_operations,false);

           dispatcher.listen("ON_END", "pipeline_show_available_operations", pipelines.load_operation,false);           


           // Filtering all tansformations ::: AOP 
           dispatcher.reset_filters();

           // filtering for timming
           dispatcher.filter( function(data_state, callback){
               var that=this;
               setTimeout(function () {
                   var history_message=that.transformation_event_type+"/"+
                           that.target.ns+((that.transformation_event_type=="ON_END")? " finished in "+that.target.diff+"ms":" ... timing ..." );
                   if(contains(history_message, "state_step_")){
                       history_message=" -------- "+history_message;
                       if(that.transformation_event_type=="ON_END")
                           $('.left_message').last().fadeOut(200, function(){ $('.left_message').last().remove();});
                   }
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
