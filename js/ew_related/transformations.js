define(["js/common.js", "js/pipelines/dispatcher.js"],
       function(common, dispatcher) {
           var result= {
               init_state_history:function (data_state, callback){
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
               save_state_history_to_cookie:function (data_state, callback){
                   
                   callback(null, data_state);
               },               
               init_footer:function (data_state, callback){
                   
                   callback(null, data_state);
               },
               init_header:function (data_state, callback){
                   
                   callback(null, data_state);
               },
               init_modals:function (data_state, callback){
                   
                   callback(null, data_state);
               },
               body_change_state:function (data_state, callback){
                   alert("the data!"+common.toJson(data_state.json));
                   
                   callback(null, data_state);
               },
               footer_update_breadcrumbs:function (data_state, callback){
                   
                   callback(null, data_state);
               },
               close_modals:function (data_state, callback){
                   
                   callback(null, data_state);
               },
               welcome:function (data_state, callback){
                   $('#left').prepend("<p >WELCOME to proposal pipes!</p>");
                   callback(null, data_state);
               },
               load_data:function(data_state, callback){
                   $('#left').prepend("<p >(simulating )Loading json data!</p>");
                   setTimeout(function () {
                       var example_data={
                           display_name: "Demo Profile Header Page",
                           type: "user",
                           header:{
                               children:[
                                   {
                                       type: "image",
                                       display_name: "You",
                                       value: "http://www.geekalerts.com/u/a-team-rc-van.jpg"
                                   },
                                   {
                                       type: "text",
                                       display_name: "Your Name",
                                       value: "Matthew Griffiths"
                                   },
                                   {
                                       type: "text",
                                       display_name: "Department",
                                       value: "Department of Fun"
                                   },
                                   {
                                       type: "text",
                                       display_name: "",
                                       value: "Everything you see on these tabs is being dynamically created from a JSON " +
                                           "schema that Bill and Matt have worked on. That means that anything on these " +
                                           "tabs can be created for any object in the EnterpriseWeb system."
                                   }
                               ]
                           },
                           actions: {
                               edit: {
                                   uri: "/save_test"
                               }
                           }};

                       data_state.json=example_data;
                       callback(null, data_state);
                   }, 250);
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

           return {transformations:common.naming_fns(result)};

       });
