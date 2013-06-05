define(["js/pipelines/dispatcher.js"],
       function(dispatcher) {
           return {register_form:function (data_state, callback){
               var target_pipeline=this.pipeline;
               $('#right').prepend("<h3 class='left_message'>show_register_form,  ...</h3>");
               $('#left').append("<div id='register_form'><h3>Login: </h3>Open Stack IP: <input type='text' id='stack_ip' value='192.168.1.22'><br> Stack User: <input type='text' id='stack_user' value='demo'><br> Password: <input type='password' id='stack_password' value='password'><br><input type='button' id='stack_logging' value='logging'></div>");

               
               $('#stack_logging').on('click', function(){

                   data_state.user=$('#stack_user').val();
                   data_state.password=$('#stack_password').val();
                   data_state.ip=$('#stack_ip').val();

                   dispatcher.dispatch("try_to_log", target_pipeline,data_state );
               });
               callback(null, data_state);
           }};
       });
