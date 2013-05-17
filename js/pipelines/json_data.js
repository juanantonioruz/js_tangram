define(function(){
    var user_data = {
        uid: "kwbMXSsBAA9MwKgAxnn9",
        uuri: "/object_test", //"/filr/UserProfile.json",
        dashboard: "/resources/services/iList/forms/full.xfrm"
    };

    var change_state_data = {
        page_type: 'object',
        state: 'object_view',
        object_uri: user_data.uuri
    };

    var test_objects={display_name: "Demo Profile Header Page",
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
                      }
                     };

    return {change_state_data:change_state_data, 
            user_data:user_data,
            test_objects: { body: {resources:[ test_objects]}}};

});
