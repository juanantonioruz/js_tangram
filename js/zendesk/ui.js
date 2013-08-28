define(["js/common.js","js/open_stack/events.js", "js/pipelines/dispatcher.js","js/zendesk/model/user.js"],
       function(common, events, dispatcher, model_user) {
           var result={};
           
 function show_dom_select(pipeline_target, data_state,  model_name, data_state_store_key, target_dom_id, select_dom_id,  the_collection,  store_model_in_option){

              return function(){
                   $(select_dom_id).remove();
                   var target=$("<select id='"+select_dom_id.replace('#', '')+"'></select>");
                   $.each(the_collection, function(i, value){
                       var option=$("<option value='"+value._hidden_+"'>"+value._visible_+"</option>");
                       if(store_model_in_option)
                           option.data("item", value.item);
                       target.append(option);
                   });

                  $(target_dom_id).append(target);
                  var idd=select_dom_id.replace('#', '');
                   $(target_dom_id).append("<input type='button' value='details' id='details_"+idd+"'>");
                   $(target_dom_id).append("<input type='button' value='edit'  id='edit_"+idd+"'>");
                  $("#edit_"+idd).on('click', function(){
                      var selected=$(select_dom_id+" option:selected").first();
                      var id=selected.val();
                      var text=selected.text();
                      data_state[data_state_store_key]=id;
                      dispatcher.dispatch("edit_"+model_name+"_selected", pipeline_target, data_state);
                      console.log(selected.val()+selected.text());
                  });
                  $("#details_"+idd).on('click', function(){
                      var selected=$(select_dom_id+" option:selected").first();
                      var id=selected.val();
                      var text=selected.text();
                      data_state[data_state_store_key]=id;
                      dispatcher.dispatch("detail_"+model_name+"_selected", pipeline_target, data_state);
                      console.log(selected.val()+selected.text());
                  });


              };
           };

           result.show_select_users=function(data_state, callback){
               var colection=data_state[model_user.data_state_key];

               colection.map(function(item){
                   item["_hidden_"]=item[model_user.data.id];
                   item["_visible_"]=item[model_user.data.human_id];
                  
               });
               show_dom_select(this, data_state, model_user.model_name, model_user.data_state_store_selected_key, "#content","#ey", colection )();

               callback(null, data_state);
           };



           result.clean_register_form=function (data_state, callback){
                   var target_pipeline=this.pipeline;
                   $('#register_form').empty();
               callback(null, data_state);
};           

           function append_button( dom_id, click_fn, the_id, the_value){
               $(dom_id).append("<input type='button' id='"+the_id+"' value='"+((the_value)?the_value:the_id)+"'>");
               $('#'+the_id).on('click', click_fn);
           }
           
           result.show_edit_user_form=function(data_state, callback){
               $('#content').append("<h1>THe user form!!</h1>");
               var that=this;
               append_button("#content", function(){
                   // data_state.user=$('#user').val()+"/token";
                   // data_state.password=$('#password').val();
                   // data_state.ip=$('#ip').val();
                   
                   dispatcher.dispatch("send_edit_user", that, data_state );
               },
                             "edit_user");
               callback(null, data_state);
           };
           

           result.register_form=function (data_state, callback){
               var target_pipeline=this.pipeline;
               $('#loading').html("zendesk");
               $('#left').append("<div id='register_form'><h3>Login: </h3> IP : <input type='text' id='ip' value='"+this.ip+"'><br>  User: <input type='text' id='user' value='"+this.user+"'><br> Password: <input type='password' id='password' value='"+this.password+"'><br><div id='buttons'/></div>");
               
               append_button("#buttons", function(){
                   data_state.user=$('#user').val()+"/token";
                   data_state.password=$('#password').val();
                   data_state.ip=$('#ip').val();
                   
                   dispatcher.dispatch(events.try_to_log, target_pipeline,data_state );
               }, "logging");


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
               console.log(this.key);
                           $('#right').prepend( "<h2>show "+this.key+": </h2><pre><code class='json'>"+common.toJson(data_state.get_value(this.key))+"</code></pre>" );                                 
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

           return common.renaming_fns(result, "ui_");
       }
      );
