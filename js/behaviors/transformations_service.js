define([  "js/behaviors/transformation_type.js", "js/jquery-1.9.1.min.js"],
       function(  T) {


           var the_time_out=1000;

           var transformations_map={};

           function create( ns, the_fn){
               var the_behavior=T.extend( function(base){
                   return {
                       ns:ns, 
                       behavior:function(event_data, callback){
                           the_fn.call(this, event_data, callback);
                       }
                   };
               });
               transformations_map[ns]=the_behavior;

           }
           

           create("load_history", function(event_data, callback){

               setTimeout(function () {
                   var user_history=[];
                   user_history.push("click here");
                   user_history.push("click there");
                   user_history.push("click here again");
                   user_history.push("click there again");
                   event_data.user_history=user_history;
                   callback(null, event_data);
               }, the_time_out);
               
           });
           
           create("show_user_history", function(event_data, callback){
               this.message(event_data.get_semantic_dom.footer.status, "showing user history ");
               $(event_data.get_semantic_dom.content.content).empty();
               setTimeout(function () {
                   
                   $(event_data.get_semantic_dom.content.content).append("<h1>user_history</h1><ul></ul>");
                   $.each(event_data.user_history, function(i, value){
                       $(event_data.get_semantic_dom.content.ul).append("<li>"+value+"</li>");
                   });
                   
                   callback(null, event_data);
               }, the_time_out);

           } );

           create("show_history",function(event_data, callback){

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
           });

           create("template_history", function(event_data, callback){
               this.message(event_data.get_semantic_dom.footer.status, "loading dynamic_template");
               setTimeout(function () {
                   event_data.template_message="the template is dynamic and now is displayed!";
                   event_data.template="<div style='background-color:green;'><h1>Behavior history</h1><ul></ul></div>";
                   
                   callback(null, event_data);
               }, the_time_out);
           } );
           
           create("attach_behaviors", function(event_data, callback){
               this.message(event_data.get_semantic_dom.footer.status, "attaching on click history behavior");
               setTimeout(function () {
                   $(event_data.get_semantic_dom.content.ul+" li").click(function(e){alert("you have clicked in user history");});
                   callback(null, event_data);
               }, the_time_out);
           });
           
           create("select_body_viewer",function(event_data, callback){
               this.message(event_data.get_semantic_dom.footer.status, "select_body_viewer");
               
               setTimeout(function () {
                   event_data.semantic_dom_target=event_data.current_context.semantic_dom.content.content;

                   callback(null, event_data);
               }, the_time_out);
           });

           create("show_history_footer_navigator", function(event_data, callback){
               this.message(event_data.get_semantic_dom.footer.status, "show_history_footer_navigator");
          
               setTimeout(function () {
                   $(event_data.current_context.semantic_dom.footer_down).html("<h2>Dynamic footer</h2><ul><li>footer 1</li><li>footer 2</li><li>footer 3</li></ul>");
                   callback(null, event_data);
               }, the_time_out);
           });

           create("display_userDashBoard",function(event_data, callback){
               this.message(event_data.get_semantic_dom.footer.status, "display_userDashBoard");
               setTimeout(function () {
                   $(event_data.semantic_dom_target).html("<h1>UserDashBoard</h1>"+toJson(event_data.userDashBoard));
                   
                   callback(null, event_data);
               }, the_time_out);
           });
           
           create("select_datasource_api_call", function(event_data, callback){
               this.message(event_data.get_semantic_dom.footer.status, "select_datasource_api_call");
               setTimeout(function () {
                   var dao={
                       load_userDashBoard:function(){return {name:"juan", interests:["walk", "travel", "sightseeing", "toys"]};}
                   };
                   event_data.dao=dao;
                   callback(null, event_data);
               }, the_time_out);
           });

           create("load_userDashBoard",function(event_data, callback){
               this.message(event_data.get_semantic_dom.footer.status, "load_userDashBoard");
               setTimeout(function () {
                   event_data.userDashBoard=event_data.dao.load_userDashBoard();
                   callback(null, event_data);
               }, the_time_out);
           });

           create("activate_start_chain_button", function(event_data, callback){
               

               setTimeout(function () {

                   $(event_data.get_semantic_dom.header.input_user.button).click(
                       
                       //alert("click"+event_data.current_context.ns);
                       //TODO: this must be in runtime, throw an string event
                       // but who is going to listen this event?
                       
                       uijuan.chains_manager['show_history']
                   );
                   callback(null, event_data);

                   
               }, the_time_out);
           });


         

           return  function(key){
              var the_function=transformations_map[key];
               if (the_function)
                   return new the_function();
               throw new Error("there isnt a function with this name: "+key);


           };
       });
