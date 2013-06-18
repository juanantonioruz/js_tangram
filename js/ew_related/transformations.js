define(["js/common.js", "js/pipelines/dispatcher.js"],
       function(common, dispatcher) {
           var result= {
               welcome:function (data_state, callback){
                   $('#center').prepend("<h3 >WELCOME to proposal pipes!</h3>");
                   callback(null, data_state);
               },
               load_data:function(data_state, callback){
                   $('#center').prepend("<h3 >(simulating )Loading json data!</h3>");
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

           return common.naming_fns(result);

       });
