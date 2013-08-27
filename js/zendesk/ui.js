define(["js/common.js","js/open_stack/events.js", "js/pipelines/dispatcher.js", "js/open_stack/model/tenant.js","js/open_stack/model/operation.js"],
       function(common, events, dispatcher, tenant_model, operation_model) {
           var result={};
         
           result.register_form=function (data_state, callback){
                   var target_pipeline=this.pipeline;


                   $('#left').append(this.runtime+"<div id='register_form'><h3>Login: </h3> IP : <input type='text' id='ip' value='"+this.ip+"'><br>  User: <input type='text' id='user' value='"+this.user+"'><br> Password: <input type='password' id='password' value='"+this.password+"'><br><input type='button' id='logging' value='logging'></div>");
                   
                   $('#logging').on('click', function(){

                       data_state.user=$('#user').val()+"/token";
                       data_state.password=$('#password').val();
                       data_state.ip=$('#ip').val();
                      
                       dispatcher.dispatch(events.try_to_log, target_pipeline,data_state );
                   });
                   callback(null, data_state);
               };

           result.simple_show=function(data_state, callback){
                           $('#content').prepend( "<h2>show "+this.key+": </h2><pre><code class='json'>"+common.toJson(data_state[this.key])+"</code></pre>" );                                 
                           callback(null, data_state);
                       };


           return common.naming_fns(result, "ui_");
       }
      );
