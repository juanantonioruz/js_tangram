define(["js/common.js","js/open_stack/events.js", "js/pipelines/dispatcher.js", "js/open_stack/model/tenant.js","js/open_stack/model/operation.js"],
       function(common, events, dispatcher, tenant_model, operation_model) {
           var result={};
           result.clean_register_form=function (data_state, callback){
                   var target_pipeline=this.pipeline;
                   $('#register_form').empty();
               callback(null, data_state);
};           
           result.register_form=function (data_state, callback){
               var target_pipeline=this.pipeline;
               $('#loading').html("zendesk");
               $('#left').append("<div id='register_form'><h3>Login: </h3> IP : <input type='text' id='ip' value='"+this.ip+"'><br>  User: <input type='text' id='user' value='"+this.user+"'><br> Password: <input type='password' id='password' value='"+this.password+"'><br><input type='button' id='logging' value='logging'></div>");
               
               $('#logging').on('click', function(){
                   
                   data_state.user=$('#user').val()+"/token";
                   data_state.password=$('#password').val();
                   data_state.ip=$('#ip').val();
                   
                   dispatcher.dispatch(events.try_to_log, target_pipeline,data_state );
               });
               callback(null, data_state);
           };

           function addButton(key, target, data_state){
               $('#register_form').append("<input type='button' id='"+key+"' value='"+key+"'>");
                   $('#'+key).on('click', function(){
                       console.log("dispathing event:"+key);
                   dispatcher.dispatch(key, target, data_state);
               });

           }


           result.show_links=function (data_state, callback){
               var target_pipeline=this.pipeline;

               ["user", "organization", "ticket", "group", "topic"].map(function(itera){
                   ["show_list", "create"].map(function(item){
                       addButton(item+"_"+itera, target_pipeline, data_state);
                   });
               $('#register_form').append("<hr>");

               });            

               callback(null, data_state);
           };

           
           result.simple_show=function(data_state, callback){
                           $('#content').prepend( "<h2>show "+this.key+": </h2><pre><code class='json'>"+common.toJson(data_state[this.key])+"</code></pre>" );                                 
                           callback(null, data_state);
                       };

           result.create_user_options=function(data_state, callback){
               var target=this;
               var options=   $('#register_form').append("<div id='options'>");
               options.append("NAME: <input type='text' id='name' value=''><br>");
               options.append("MAIL: <input type='text' id='email' value=''><br>");
               options.append(" <input type='button' id='send_data' value='send'><br>").on('click', '#send_data', function(){
                   alert("creating user!!");
                   data_state.create_user_options={user:{name:$('#name').val(), email:$('#email').val()}};
                   dispatcher.dispatch("send_create_user", target,data_state );
                   
               });

               callback(null, data_state);
           };

           return common.naming_fns(result, "ui_");
       }
      );
