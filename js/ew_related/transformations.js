define(["js/common.js", "js/pipelines/dispatcher.js", "js/ew_related/json_data.js"],
       function(common, dispatcher, json_data) {
           function clone(object)
           {
               var newObj = (object instanceof Array) ? [] : {};
               for (var i in object)
               {
                   if (i == 'clone')
                       continue;
                   if (object[i] && typeof object[i] == "object")
                       newObj[i] = clone(object[i]);
                   else
                       newObj[i] = object[i];
               }
               return newObj;
           }
           function is_a_number(n) {
               return !isNaN(parseFloat(n)) && isFinite(n);
           }


           var result= {
              
               body_change_state:function (data_state, callback){
                   console.log("the data!"+common.toJson(data_state.change_state_data));
                   //data_state.view_type="object_view"||"modal" ....
                   data_state.view_type=data_state.change_state_data.state;
                   callback(null, data_state);
               },
               
               footer_update_breadcrumbs:function (data_state, callback){
                   
                   callback(null, data_state);
               },
               
               generate_uid:function(data_state, callback){
                   function create_id(prefix, subject) {
                       var id = prefix + "";
                       for (var x=0; x<subject.length; x++)
                           if(/^[a-zA-Z]$/.test(subject[x]))
                               id += subject[x];
                       id = id.toLowerCase();
                       return id;
                   }

                   function guid(){
                       var id = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(
                               /[xy]/g,
                           function(c){
                               var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);
                           }
                       );
                       return "id_" + id;
                   }

                   var object_id = (data_state.current_data.id != null)
                           ? create_id('object', data_state.current_data.id)
                           : guid();
                   
                   data_state.current_data.id=object_id;
                   //  container.attr('id', object_id);
                   callback(null, data_state);
               }
               
           };
           var update={
               loading_object_editor:function (data_state, callback){
                   callback(null, data_state);
               },
               body_current_state_display_name:function (data_state, callback){
                   callback(null, data_state);
               }
               
           };
           var modals={
               init:function (data_state, callback){
                   callback(null, data_state);
               },
               close:function (data_state, callback){
                   callback(null, data_state);
               }
           };
           var dao={
               load_data:function(data_state, callback){
                   $('#left').prepend("<p >(simulating )Loading json data!</p>");
                   setTimeout(function () {
                       data_state.json=json_data.example_data;
                       callback(null, data_state);
                   }, 250);
               },
               load_dashboard_data:function(data_state, callback){
                   var json=json_data.dashboard_data;
                   var user_data = {
                       uid: json.uid,
                       uri: json.uuri
                   };
                   $('body').data("user_data", user_data);
                   data_state.change_state_data = {
                       page_type: 'object',
                       state: 'object_view',
                       object_uri: user_data.uri
                   };

                   callback(null, data_state);
               },
               load_pages_main_data:function(data_state, callback){
                   var json=json_data[data_state.change_state_data.object_uri];
                   
                   data_state.main_data=json;
                   data_state.resource=json.body.resources[0];

                   console.dir(data_state.resource);
                   callback(null, data_state);
               }
           };
           var renders={    
               modal:function(data_state, callback){
                   callback(null, data_state);
               },
               footer:function (data_state, callback){
                   
                   callback(null, data_state);
               },
               header:function (data_state, callback){
                   
                   callback(null, data_state);
               },
               page_body:function(data_state, callback){
                   data_state.page_type=data_state.change_state_data.page_type;
                   callback(null, data_state);
               },
               pages_main:function(data_state, callback){
                   callback(null, data_state);
               },
               task:function(data_state, callback){
                   callback(null, data_state);
               },
               activity_list:function(data_state, callback){
                   callback(null, data_state);
               },
               clean_trays:function(data_state, callback){
                   callback(null, data_state);
               },
               trays:function(data_state, callback){
                   callback(null, data_state);
               }
            
           };

           var templates={
               load_object_viewer:function(data_state, callback){
                   console.log("loading 'object_viewer' template with this resource: "+data_state.resource);
                  
                   callback(null, data_state);
               }
           };
           var cache_data={
               page_body:function(data_state, callback){
                   console.log("TODO");
                   callback(null, data_state);
               },
               object_viewer:function(data_state, callback){
                   var r=data_state.get_value("resource.header.children[0].value");
                   alert(common.toJson(r));
                   callback(null, data_state);
               }
           };
           
        

           var state_history={
               init:function (data_state, callback){
                   var body = $('body');

                   //Get any state history from the cookie
                   var state_history_from_cookie = $.cookie('state_history');

                   //Check to see if there is any history
                   if (state_history_from_cookie !== undefined) {

                       //Parse from json
                       var state_history = JSON.parse(state_history_from_cookie);

                       //Add the cookie persisted state history to the data
                       body.data('state_history', state_history);
                   }else {

                       //Create the state history as an empty array
                       //                var state_history = [];

                       //Add this to the data
                       body.data('state_history', []);

                       //Create a new cookie for it
                       $.cookie('state_history', JSON.stringify(state_history), { expires:365, path:'/', json:true });
                   }


                   callback(null, data_state);
               },
               prepare:function (data_state, callback){
                   var data=data_state.change_state_data;

                   var state_history = $('body').data('state_history');

                   if (state_history.length >= 11)
                       state_history.splice(0, state_history.length - 10);

                   var index_of_active_state = state_history.length - 1;

                   //Loop through all the state items
                   $.each(state_history, function(index, item){

                       //Only interested in active items
                       if (!item.active)
                           return;

                       //Set the index of active state for later
                       index_of_active_state = index;

                       //Mark each as inactive
                       item.active = false;
                   });


                   //If the state change is up or down the state history
                   if (is_a_number(data)) {

                       //Ensure the data value is a int
                       var index = parseInt(data);

                       //Extract the intended state from the state history array
                       data = clone(state_history[index]);
                   }
                   else {

                       //This is a new state and wont have a display name so show the spinning icon
                       data.display_name = "<img src='../pix/logo_ew_single_star_grey.png' class='icon-spin'/>";
                   }

                   //Add the data to the state history
                   state_history[state_history.length] = data;

                   //Mark the new state as active
                   data.active = true;

                   //set the start time
                   data.time_in = new Date();

                   //set the time out too - note: this is reset every minute in the init function of the body
                   data.time_out = new Date();
                   data_state.state_history=state_history;
                   callback(null, data_state);
               },
                save_to_cookie:function(data_state, callback){
                   var state_history=data_state.state_history;
                   $('body').data('state_history', state_history);
                   $.cookie('state_history', JSON.stringify(state_history), { expires:365, path:'/', json:true });
                   callback(null, data_state);
               }
           };


           return {
               templates:common.naming_fns(templates, "template_"),
               update:common.naming_fns(update, "update_"),
               state_history:common.naming_fns(state_history, "state_history_"),

               dao:common.naming_fns(dao, "dao_"),
               modals:common.naming_fns(modals, "modals_"),
               transformations:common.naming_fns(result),
               renders:common.naming_fns(renders, "render_"),
               cache_data:common.naming_fns(cache_data, "cache_data_")};

       });
