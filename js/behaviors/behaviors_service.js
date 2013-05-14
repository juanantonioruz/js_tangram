define([  "js/behaviors/behavior_type.js", "js/jquery-1.9.1.min.js"],
       function(  B) {


           var the_time_out=1000;

     

           var load_history=B.extend( function(base){
               return {
                   
                   behavior:function(event_data, callback){

                       setTimeout(function () {
                           var user_history=[];
                           user_history.push("click here");
                           user_history.push("click there");
                           user_history.push("click here again");
                           user_history.push("click there again");
                           event_data.user_history=user_history;
                           callback(null, event_data);
                       }, the_time_out);
                       
                   }
                   
               };
           });
           
           var show_user_history=B.extend( function(base){
               return {
                   
                   behavior:function(event_data, callback){
                       base.behavior(event_data, callback);
                       this.message(event_data.get_semantic_dom.footer.status, "showing user history ");
                       $(event_data.get_semantic_dom.content.content).empty();
                       setTimeout(function () {
                           
                           $(event_data.get_semantic_dom.content.content).append("<h1>user_history</h1><ul></ul>");
                           $.each(event_data.user_history, function(i, value){
                               $(event_data.get_semantic_dom.content.ul).append("<li>"+value+"</li>");
                           });
                           
                           callback(null, event_data);
                       }, the_time_out);

                   }
                   
               };
           });

           var show_history=B.extend( function(base){
               return {
                   
                   behavior:function(event_data, callback){
                       base.behavior(event_data, callback);
                       this.message(event_data.get_semantic_dom.footer.status, "showing history");
                       $(event_data.get_semantic_dom.modal.history.history).empty();
                       setTimeout(function () {

                           $(event_data.get_semantic_dom.modal.history.history).append(event_data.template);
                           $.each(event_data.behavior_history, function(i, value){
                               $(event_data.get_semantic_dom.modal.history.ul).append("<li>"+value+"</li>");
                           });
                           // $('#event_history div ul').after("<h2>"+event_data.template_message+"</h2>");
                           callback(null, event_data);
                       }, the_time_out);
                   }
                   
               };
           });

           var template_history=B.extend( function(base){
               return {
                   
                   behavior:function(event_data, callback){
                       this.message(event_data.get_semantic_dom.footer.status, "loading dynamic_template");
                       setTimeout(function () {
                           event_data.template_message="the template is dynamic and now is displayed!";
                           event_data.template="<div style='background-color:green;'><h1>Behavior history</h1><ul></ul></div>";
                           
                           callback(null, event_data);
                       }, the_time_out);
                   }
                   
               };
           });
           
           
           var attach_behaviors=B.extend( function(base){
               return {
                   
                   behavior:function(event_data, callback){
                       this.message(event_data.get_semantic_dom.footer.status, "attaching on click history behavior");
                       setTimeout(function () {
                           $(event_data.get_semantic_dom.content.ul+" li").click(function(e){alert("you have clicked in user history");});
                           callback(null, event_data);
                       }, the_time_out);
                   }
                   
               };
           });
           
           var activate_start_chain_button=B.extend( function(base){
               return {
                   
                   behavior:function(event_data, callback){
                       base.behavior(event_data, callback);

                       setTimeout(function () {

                               $(event_data.get_semantic_dom.header.input_user.button).click(
                                   
                                   //alert("click"+event_data.current_context.ns);
                                   //TODO: this must be in runtime, throw an string event
                                   // but who is going to listen this event?
           
                                   uijuan.chains_manager['show_history']
                                   );
                               callback(null, event_data);

                           
                       }, the_time_out);
                   }
                   
               };
           });


               var load_userDashBoard=B.extend( function(base){
               return {
                   behavior:function(event_data, callback){
                       this.message(event_data.get_semantic_dom.footer.status, "load_userDashBoard");
                       setTimeout(function () {
                           event_data.userDashBoard=event_data.dao.load_userDashBoard();
                           callback(null, event_data);
                       }, the_time_out);
                   }
                   
               };
           });

               var select_datasource_api_call=B.extend( function(base){
               return {
                   
                   behavior:function(event_data, callback){
                       this.message(event_data.get_semantic_dom.footer.status, "select_datasource_api_call");
                       setTimeout(function () {
                           var dao={
                               load_userDashBoard:function(){return {name:"juan", interests:["walk", "travel", "sightseeing", "toys"]};}
                           };
                           event_data.dao=dao;
                           callback(null, event_data);
                       }, the_time_out);
                   }
                   
               };
           });

            var display_userDashBoard=B.extend( function(base){
               return {
                   behavior:function(event_data, callback){
                       this.message(event_data.get_semantic_dom.footer.status, "display_userDashBoard");
                       setTimeout(function () {
                           $(event_data.semantic_dom_target).html("<h1>UserDashBoard</h1>"+toJson(event_data.userDashBoard));
      
                           callback(null, event_data);
                       }, the_time_out);
                   }
                   
               };
           });

var select_body_viewer=B.extend( function(base){
               return {
                   behavior:function(event_data, callback){
                       this.message(event_data.get_semantic_dom.footer.status, "select_body_viewer");
                    
                       setTimeout(function () {
                           event_data.semantic_dom_target=event_data.current_context.semantic_dom.content.content;

                           callback(null, event_data);
                       }, the_time_out);
                   }
                   
               };
           });

           var show_history_footer_navigator=B.extend( function(base){
               return {
                   behavior:function(event_data, callback){
                       this.message(event_data.get_semantic_dom.footer.status, "show_history_footer_navigator");
                       
                       setTimeout(function () {

                           $(event_data.current_context.semantic_dom.footer_down).html("<h2>Dynamic footer</h2><ul><li>footer 1</li><li>footer 2</li><li>footer 3</li></ul>");

                           callback(null, event_data);
                       }, the_time_out);
                   }
                   
               };
           });


           var behaviors_map={};

           behaviors_map["show_history_footer_navigator"]=show_history_footer_navigator;
          behaviors_map["select_body_viewer"]=select_body_viewer;
           behaviors_map["display_userDashBoard"]=display_userDashBoard;
           behaviors_map["select_datasource_api_call"]=select_datasource_api_call;
           behaviors_map["load_userDashBoard"]=load_userDashBoard;
           behaviors_map["load_history"]=load_history;
           behaviors_map["show_history"]=show_history;
           behaviors_map["template_history"]=template_history;
           behaviors_map["show_user_history"]=show_user_history;
           behaviors_map["attach_behaviors"]=attach_behaviors;
           behaviors_map["activate_start_chain_button"]=activate_start_chain_button;

           return  function(key){
               //        console.log("asking for: "+key);
               //        console.dir(key);
               return   new behaviors_map[key](key);
           };
       });
