define(["js/common.js", "js/pipelines/dispatcher.js"],
       function(common, dispatcher) {
           var result={
                  register_form:function (data_state, callback){
               var target_pipeline=this.pipeline;
               $('#right').prepend("<h3 class='left_message'>show_register_form,  ...</h3>");
//
               $('#left').append("<div id='register_form'><h3>Login: </h3>Open Stack IP (internal_ip:192.168.1.100,  external_ip: 85.136.107.32): <input type='text' id='stack_ip' value='85.136.107.32'><br> Stack User: <input type='text' id='stack_user' value='admin'><br> Password: <input type='password' id='stack_password' value='password'><br><input type='button' id='stack_logging' value='logging'></div>");

               
               $('#stack_logging').on('click', function(){

                   data_state.user=$('#stack_user').val();
                   data_state.password=$('#stack_password').val();
                   data_state.ip=$('#stack_ip').val();

                   dispatcher.dispatch("try_to_log", target_pipeline,data_state );
               });
               callback(null, data_state);
           },
               list_resources:function (data_state, callback){
                   $('#center').prepend("<h1 >Listing list_resources,  ...</h1>");
                   callback(null, data_state);
               },
               create_server:function (data_state, callback){
                   $('#center').prepend("<h1 >Listing create_server,  ...</h1>");
                   callback(null, data_state);
               }

              };
              return common.naming_fns(result);
       });
