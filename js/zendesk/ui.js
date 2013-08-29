define(["js/common.js","js/open_stack/events.js", "js/pipelines/dispatcher.js","js/zendesk/model/user.js","js/zendesk/model/organization.js","js/zendesk/model/ticket.js"],
       function(common, events, dispatcher, user_model,org_model, ticket_model) {
           var result={};
           
           function show_dom_select(pipeline_target, data_state,  model_name, data_state_store_key, target_dom_id, select_dom_id,  the_collection,  store_model_in_option){

              return function(){
                   $(select_dom_id).remove();
                  var idd=select_dom_id.replace('#', '');

                   $("#details_"+idd).remove();
                  $("#edit_"+idd).remove();


                   var target=$("<select id='"+idd+"'></select>");
                   $.each(the_collection, function(i, value){
                       var option=$("<option value='"+value._hidden_+"'>"+value._visible_+"</option>");
                       if(store_model_in_option)
                           option.data("item", value.item);
                       target.append(option);
                   });

                  $(target_dom_id).append(target);

                   $(target_dom_id).append("<input type='button' value='details' id='details_"+idd+"'>");
                   $(target_dom_id).append("<input type='button' value='edit'  id='edit_"+idd+"'>");

                  function select_object(op){
                      var selected=$(select_dom_id+" option:selected").first();
                      var id=selected.val();
                      var text=selected.text();
                      data_state[data_state_store_key]=id;
                      dispatcher.dispatch(op+model_name+"_selected", pipeline_target, data_state);
                      console.log(selected.val()+selected.text());
                  }
                  

                  $("#edit_"+idd).on('click', function(){
                    select_object("edit_");
                  });
                  $("#details_"+idd).on('click', function(){
                    select_object("detail_");
                  });


              };
           };

           function append_button( dom_id, click_fn, the_id, the_value){
               $(dom_id).append("<input type='button' id='"+the_id+"' value='"+((the_value)?the_value:the_id)+"'>");
               $('#'+the_id).on('click', click_fn);
           };
           function append_input_text( dom_id, label, the_class, the_id, the_value, change_fn){
               $(dom_id).append(((label)?"<br>"+label.toUpperCase()+"<br>":"<br>")+"<input type='text' class='"+the_class+"' id='"+the_id+"' value='"+((the_value)?the_value:"")+"'>");

//               $('#'+the_id).on('click', click_fn);
           };

           function addButton(key, target, data_state){
               $('#register_form').append("<input type='button' id='"+key+"' value='"+key+"'>");
                   $('#'+key).on('click', function(){
                       console.log("dispathing event:"+key);
                   dispatcher.dispatch(key, target, data_state);
               });

           };

           function generate_human_collection(data_state, model){
               var colection=data_state[model.data_state_key];

               colection.map(function(item){
                   item["_hidden_"]=item[model.data.id];
                   item["_visible_"]=item[model.data.human_id];
                  
               });
               return colection;
           }


           result.show_select_users=function(data_state, callback){
              

               show_dom_select(this, data_state, user_model.model_name, user_model.data_state_store_selected_key, "#content","#ey", generate_human_collection(data_state, user_model) )();

                       $("#ey").css("margin", "200px").css("background-color", "red");


               callback(null, data_state);
           };


           result.show_select_orgs=function(data_state, callback){
               show_dom_select(this, data_state, org_model.model_name, org_model.data_state_store_selected_key, "#content","#ey", generate_human_collection(data_state, org_model)  )();
               callback(null, data_state);
           };
           result.show_select_tickets=function(data_state, callback){
               show_dom_select(this, data_state, ticket_model.model_name, ticket_model.data_state_store_selected_key, "#content","#ey", generate_human_collection(data_state, ticket_model)  )();
               callback(null, data_state);
           };


           result.clean_register_form=function (data_state, callback){
                   var target_pipeline=this.pipeline;
                   $('#register_form').empty();
               callback(null, data_state);
};           
           
           result.show_edit_user_form=function(data_state, callback){

               var form_id="user_form";
               $('#'+form_id).remove();
               $('#content').append("<div id='"+form_id+"'></div>");

               $('#'+form_id).append("<h1>The user form!!</h1>");
               $('#'+form_id).append("<div id='fields'></div>");
               $('#'+form_id).append("<div id='buttons'></div>");
               var that=this;
                   var object_model_stored=data_state[user_model.data_state_store_selected_object][user_model.model_name];
               Object.keys(user_model.data.human).map(function(item){
                   var o=user_model.data.human[item];

                   // component_type=o.type
                       append_input_text("#fields",  o.key, user_model.model_name, o.key, object_model_stored[o.key]);
                   
               });
               
               append_button("#buttons", function(){
                   // data_state.user=$('#user').val()+"/token";
                   // data_state.password=$('#password').val();
                   // data_state.ip=$('#ip').val();

                   var mod={user:{}};
                   $('.'+user_model.model_name).each(function(){

                       mod[user_model.model_name][$(this).attr('id')]=$(this).val();
                   });
           //        console.dir(mod);
                   data_state[user_model.data_state_store_object_on_editing]=mod;
                   dispatcher.dispatch("send_edit_user", that, data_state );
               },
                             "edit_user");
               callback(null, data_state);
           };
           result.show_edit_organization_form=function(data_state, callback){

             
               callback(null, data_state);
           };

           result.show_edit_ticket_form=function(data_state, callback){

             
               callback(null, data_state);
           };
           



           result.inject_reg_values=function(data_state, callback){

               if($('#user').val()!==undefined){
               data_state.user=$('#user').val()+"/token";
                   data_state.password=$('#password').val();
                   data_state.ip=$('#ip').val();
               }else
               console.log("INFO: in debug mode maybe there is not the form in the page so we can switch this part!");
               callback(null, data_state);
           };



           result.register_form=function (data_state, callback){
               var target_pipeline=this.pipeline;
               $('#loading').html("zendesk");
               $('#register_form').remove();
               $('#left').append("<div id='register_form'><h3>Login: </h3> IP : <input type='text' id='ip' value='"+this.ip+"'><br>  User: <input type='text' id='user' value='"+this.user+"'><br> Password: <input type='password' id='password' value='"+this.password+"'><br><div id='buttons'/></div>");
               
               append_button("#buttons", function(){
                   dispatcher.dispatch(events.try_to_log, target_pipeline,data_state );
               }, "logging");


               callback(null, data_state);
           };

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
