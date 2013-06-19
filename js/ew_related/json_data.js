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


var real_test_objects = {
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
    },
    children:[
        {
            display_name: "Lifecycle History & Relationships",
            type: "object",
            children: [
                {
                    display_name: "Relationships",
                    type: 'object',
                    children: [
                        {
                            display_name: 'Relationships',
                            type: 'relationships',
                            relationships: [
                                {
                                    type: 'relationship',
                                    display_name: 'Relationship 1',
                                    uri: '/object_test',
                                    header: [
                                        {display_name: 'Key1', value: 'Value1'},
                                        {display_name: 'Key2', value: 'Value2'}
                                    ],
                                    children: [
                                        {display_name: 'Key1', value: 'Value1'},
                                        {display_name: 'Key2', value: 'Value2'}
                                    ],
                                    actions: [
                                        {
                                            type: 'quick_view',
                                            display_name: "view this object",
                                            uri: "/object_test",
                                            page_type: "object",
                                            prevent_action_button: true
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    display_name: "Lifecycle History",
                    type: "object",
                    children: [
                        {
                            display_name: "A lifecycle history",
                            type: "lifecycle_history",
                            history: [
                                {
                                    active: false,
                                    author: "Archita Bhatt",
                                    comment: "New Project Created",
                                    date: 'Thu Nov 01 2012 15:40:38 GMT-0400 (EDT)',
                                    result: 'Proposal Sent for Review',
                                    uri: '/object_test'
                                },
                                {
                                    active: false,
                                    author: "Archita Bhatt",
                                    comment: "New Project Created",
                                    date: 'Thu Nov 01 2012 15:40:38 GMT-0400 (EDT)',
                                    result: 'Proposal Sent for Review'
                                },
                                {
                                    active: true,
                                    author: "Archita Bhatt",
                                    comment: "New Project Created",
                                    date: 'Thu Nov 01 2012 15:40:38 GMT-0400 (EDT)',
                                    result: 'Proposal Sent for Review'
                                },
                                {
                                    active: false,
                                    author: "Archita Bhatt",
                                    comment: "New Project Created",
                                    date: 'Thu Nov 01 2012 15:40:38 GMT-0400 (EDT)',
                                    result: 'Proposal Sent for Review'
                                },
                                {
                                    selected: false,
                                    author: "Archita Bhatt",
                                    comment: "New Project Created",
                                    date: 'Thu Nov 01 2012 15:40:38 GMT-0400 (EDT)',
                                    result: 'Proposal Sent for Review'
                                },
                                {
                                    selected: false,
                                    author: "Archita Bhatt",
                                    comment: "New Project Created",
                                    date: 'Thu Nov 01 2012 15:40:38 GMT-0400 (EDT)',
                                    result: 'Proposal Sent for Review'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            display_name: "Metadata Demo",
            type: "object",
            children: [
                {
                    display_name: "Metaform example",
                    type: "object",
                    children: [
                        {
                            display_name: "A simple label",
                            type: "text",
                            value: "With an embedded form",
                            metadata:[
                                {
                                    type: "metaform",
                                    display_name: 'Mouse over here to see something cool!',
                                    form: {
                                        display_name: "Small Bar Charts",
                                        type: "object",
                                        children: [
                                            {
                                                display_name: "A sample bar chart with size set to small",
                                                type: "chart_bar",
                                                size: 'small',
                                                values: [
                                                    { name: "Series One", values: [100,200,300,400] },
                                                    { name: "Series Two", values:[200,100,0,300]}
                                                ],
                                                x_axis_labels: ['Jan', 'Feb', 'Mar', 'Apr'],
                                                value_format_string: "$%d"
                                            },
                                            {
                                                display_name: "Just testing other things",
                                                type: "object",
                                                children: [
                                                    {
                                                        display_name: "A text box",
                                                        type: "text",
                                                        value:"something",
                                                        actions: {
                                                            edit: {}
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    display_name: "Change Suggested Metadata",
                    type: "object",
                    children: [
                        {
                            display_name: "A textbox with a change suggested",
                            type: "text",
                            value: "this is a value",
                            editable: true,
                            metadata: [
                                {
                                    type: "change_suggested",
                                    history_items: [
                                        {
                                            author: {
                                                image: "http://cdn1.iconfinder.com/data/icons/web2/Icons/FaceBook_48x48.png",
                                                name: "A user"
                                            },
                                            value: "this is my comment"
                                        },
                                        {
                                            author: {
                                                image: "http://cdn1.iconfinder.com/data/icons/web2/Icons/FaceBook_48x48.png",
                                                name: "A nother user"
                                            },
                                            value: "this is my comment 2",
                                            uri: "/save_test"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    display_name: "Note Metadata",
                    type: "object",
                    children: [
                        {
                            display_name: "A label",
                            value: "with a small note",
                            type: "text",
                            metadata: [
                                {
                                    type: "note",
                                    small_note: "What a lovely little note."
                                }
                            ]
                        },
                        {
                            display_name: "A label",
                            value: "with a large note",
                            type: "text",
                            metadata: [
                                {
                                    type: "note",
                                    small_note: "What a lovely little note.",
                                    large_note: "This is the expanded note that can say a lot more then you could fit " +
                                                "into the small one."
                                }
                            ]
                        }
                    ]
                },
                {
                    display_name: "Comments Metadata",
                    help_message: "both cause save actions but the label will not render any save update notification",
                    type: "object",
                    children: [
                        {
                            display_name: "A label",
                            value: "with a comment",
                            type: "text",
                            metadata: [
                                {
                                    type: "comments",
                                    small_note: "You should act on this comment"
                                }
                            ]
                        },
                        {
                            display_name: "A textbox",
                            value: "with a comment",
                            type: "text",
                            editable: true,
                            metadata: [
                                {
                                    type: "comments",
                                    small_note: "You should act on this comment"
                                }
                            ]
                        }
                    ],
                    actions: [
                        {
                            type: "update",
                            uri: "/save_test"
                        }
                    ]
                }
            ]
        },
        {
            display_name: "Actions Demo",
            type: "object",
            children: [
                {
                    display_name: "Testing the view action with an object link",
                    type: "object",
                    help_message: "These actions can be applied to any type of object, I'm using text here!",
                    children: [
                        {
                            display_name: "A simple label",
                            type: "text",
                            value: "You can right click me!",
                            actions:[
                                {
                                    type: "view",
                                    page_type:"object",
                                    uri:"/object_test",
                                    display_name:"View This Object"
                                },
                                {
                                    type: "quick_view",
                                    page_type:"object",
                                    uri:"/object_test",
                                    display_name:"View This Object"
                                }
                            ]
                        }
                    ]
                },
                {
                    display_name: "Testing the view action with a task link",
                    type: "object",
                    children: [
                        {
                            display_name: "A simple label",
                            type: "text",
                            value: "You can right click me!",
                            actions:[
                                {
                                    type: "view",
                                    page_type:"task",
                                    uri:"../filr/OiFXLy8BALwkwKkAvVoB/task.json",
                                    display_name:"View This Task"
                                },
                                {
                                    type: "quick_view",
                                    page_type:"task",
                                    uri:"../filr/OiFXLy8BALwkwKkAvVoB/task.json",
                                    display_name:"View This Task"
                                }
                            ]
                        }
                    ]
                },
                {
                    display_name: "Testing the meta view",
                    type: "object",
                    children:[
                        {
                            display_name:"There is a graph hidden under me",
                            type: "text",
                            value: "you'll see",
                            actions:[
                                {
                                    type:"meta_view",
                                    form:
                                    {
                                        display_name: "Medium Bar Charts",
                                        type: "object",
                                        children: [
                                            {
                                                display_name: "A sample bar chart with size set to medium",
                                                type: "chart_bar",
                                                size: 'medium',
                                                values: [
                                                    { name: "Series One", values: [100,200,300,400] },
                                                    { name: "Series Two", values:[200,100,0,300]}
                                                ],
                                                x_axis_labels: ['Jan', 'Feb', 'Mar', 'Apr'],
                                                value_format_string: "$%d"
                                            },
                                            {
                                                display_name: "Just testing other things",
                                                type: "object",
                                                children: [
                                                    {
                                                        display_name: "A text box",
                                                        type: "text",
                                                        value:"something",
                                                        actions: {
                                                            edit: {}
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    display_name: "Testing the meta edit",
                    type: "object",
                    children:[
                        {
                            display_name:"You could change this section of the form",
                            type: "text",
                            value: "click and you'll see",
                            actions:[
                                {
                                    type:"meta_edit",
                                    form:
                                    {
                                        display_name: "This is the form you can use to change the parent",
                                        type: "object",
                                        children: [
                                            {
                                                display_name: "Just testing other things",
                                                type: "object",
                                                children: [
                                                    {
                                                        display_name: "A text box",
                                                        type: "text",
                                                        value:"something",
                                                        actions: {
                                                            edit: {}
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    display_name: "Testing the find and replace action",
                    type: "object",
                    children: [
                        {
                            type: "embedded_user",
                            display_name: "Embedded Objects",
                            help_message: "This is not working 100% yet but you'll get the idea: This is a summary of a user, by clicking the replace button you are taken to a user search where you can pick a user to replace this one.",
                            value: 'filr/ideate/entity/People/records/000373/resource.json', //the uri of the embedded user
                            children: [
                                {
                                    type: "image",
                                    value: "http://www.geekalerts.com/u/a-team-rc-van.jpg",
                                    display_name: "Picture"
                                },
                                {
                                    type: "text",
                                    display_name: "Name",
                                    value: "Mr T"
                                },
                                {
                                    type: "text",
                                    display_name: "Department",
                                    value: "Department of Gold"
                                }
                            ],
                            actions:[
                                {
                                    type: "find_and_replace",
                                    search_data: {
                                        selected_facets:[
                                            { name: "type", value: "People"}
                                        ]
                                    }

                                }
                            ]
                        },
                    ]
                },
                {
                    display_name: "Testing the graph action",
                    type: "object",
                    help_message: "This wont work at the moment as we need a valid uri",
                    children: [
                        {
                            display_name:"There is a graph hidden under me",
                            type: "text",
                            value: "you'll see",
                            actions:[
                                {
                                    type: 'graph',
                                    uri: 'some_uri'
                                }
                            ]
                        }
                    ]
                },
                {
                    display_name: "Testing reorder action",
                    type: "object",
                    children: [
                        {
                            display_name: "You can drag me around",
                            type: "text",
                            value: "Try it!",
                            actions:[
                                {
                                    type: "reorder",
                                    group_id: "1"
                                }
                            ]
                        },
                        {
                            display_name: "You can drag me around and my children move too",
                            type: "object",
                            children: [
                                {
                                    display_name: "I'll go too",
                                    type: "text",
                                    value: "Try it!"
                                }
                            ],
                            actions:[
                                {
                                    type: "reorder",
                                    group_id: "1"
                                }
                            ]
                        },
                        {
                            display_name: "You can drag me around too",
                            type: "text",
                            value: "Try it!",
                            actions:[
                                {
                                    type: "reorder",
                                    group_id: "1"
                                }
                            ]
                        }
                    ],
                    actions: [
                        {
                            type: "reorder",
                            uri: "SomeUri.json"
                        }
                    ]
                },
                {
                    display_name: "How actions render on different types of objects",
                    type: "object",
                    help_message: "These actions do not do anything so please dont click them.",
                    children:[
                        {
                            display_name: "Object level action",
                            type: "object",
                            children: [
                                {
                                    display_name: "Just a label",
                                    type: "text",
                                    value: "with no action"
                                },
                                {
                                    display_name: "Just a label",
                                    type: "text",
                                    value: "with no action"
                                },
                                {
                                    display_name: "Just a label",
                                    type: "text",
                                    value: "with no action"
                                }
                            ],
                            actions: [
                                {
                                    type: "view"
                                }
                            ]
                        },
                        {
                            display_name: "Actions in table rows",
                            type:"object",
                            children: [
                                {
                                    display_name: "Table Layout Example",
                                    help_message: "Showing cell level and row level action button",
                                    type: "object_table",
                                    mutable: false,
                                    column_headers: [
                                        { display_name: "ID", object_display_name: "ID" },
                                        { display_name: "Name", object_display_name: "Name" },
                                        { display_name: "Department", object_display_name: "Department" },
                                        { display_name: "Role", object_display_name: "Role" }
                                    ],
                                    children: [
                                        {
                                            display_name: "Matthew Griffiths",
                                            type: "object_table_row",
                                            uri: '/update',
                                            children:[
                                                {
                                                    type: "text",
                                                    display_name: "ID",
                                                    value: "01",
                                                    display_type: "table_cell"
                                                },
                                                {
                                                    type: "text",
                                                    display_name: "Name",
                                                    value: "Matthew Griffiths",
                                                    display_type: "table_cell",
                                                    actions:[
                                                        { type: "view"}
                                                    ]
                                                },
                                                {
                                                    type: "select",
                                                    display_name: "Department",
                                                    value: "1",
                                                    values: [
                                                        { name: "Department of Fun", value: "0" },
                                                        { name: "Department of Games", value: "1" }
                                                    ],
                                                    actions: {
                                                        edit: {
                                                            uri: "/save_test"
                                                        }
                                                    },
                                                    display_type: "table_cell"
                                                },
                                                {
                                                    type: "text",
                                                    display_name: "Role",
                                                    value: "Master of the universe",
                                                    actions: {
                                                        edit: {}
                                                    },
                                                    display_type: "table_cell"
                                                },
                                                {
                                                    type: "text",
                                                    display_type: "table_cell",
                                                    actions:[
                                                        { type: "view"}
                                                    ]
                                                }
                                            ]
                                        }
                                    ],
                                    actions: {
                                        edit: {
                                            uri: '/save_test'
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            display_name: "Basic form elements demo",
            type: "object",
            children: [
                {
                    display_name: "Yes/No Demo",
                    type: "object",
                    help_message: "Below you can see both an editable and a non editable boolean choice.",
                    children: [
                        {
                            type: "boolean",
                            display_name: "Editable",
                            help_message: "Save wont work but you can try!",
                            value: false,
                            editable: true,
                            actions:[
                                {
                                    type: "update"
                                }
                            ]
                        },
                        {
                            type: "boolean",
                            display_name: "Not Editable",
                            value: true
                        }
                    ],
                    actions: [
                        {
                            type: "update",
                            uri: "/save_test"
                        }
                    ]
                },
                {
                    display_name: "Text Demo",
                    type: "object",
                    help_message: "Here you can see text boxes, with and without validation",
                    children:[
                        {
                            type: "text",
                            display_name:"Uneditable text",
                            value: "You can't change me :p"
                        },
                        {
                            type: "text",
                            display_name:"Text with a $ mask",
                            value: "3,456.00",
                            mask: "${value}"
                        },
                        {
                            type: "text",
                            display_name: "Editable Text",
                            help_message: "This text box has no validation so you can enter whatever you like.",
                            editable: true,
                            actions:[
                                {
                                    type: "update"
                                }
                            ]
                        },
                        {
                            type: "text",
                            display_name: "Email Validation",
                            help_message: "This element will be in error state if the content is not a valid email address",
                            editable: true,
                            actions:[
                                {
                                    type: "update"
                                }
                            ],
                            validation: {
                                email: {}
                            }
                        },
                        {
                            type: "text",
                            display_name: "Phonenumber Validation",
                            help_message: "This element will be in error state if the content contains anything other than number",
                            editable: true,
                            actions:[
                                {
                                    type: "update"
                                }
                            ],
                            validation: {
                                phonenumber: {}
                            }
                        },
                        {
                            type: "text",
                            display_name: "Can not be saved",
                            help_message: "As you type this element will try to save (like all the other) but will fail.",
                            editable: true,
                            actions:[
                                {
                                    type: "update",
                                    uri: "/foo"
                                }
                            ]
                        }
                    ],
                    actions: [
                        {
                            type: "update",
                            uri: "/save_test"
                        }
                    ]
                },
                {
                    display_name: "Date Picker Demo",
                    type: "object",
                    help_message: "This shows the date picker widget",
                    children: [
                        {
                            type: "date",
                            display_name: "Date picker example",
                            help_message: "This date picker can be used anywhere, it can also be extended to include time!",
                            editable: true,
                            actions: [
                                {
                                    type: "update",
                                    uri: "/save_test"
                                }
                            ]
                        },
                        {
                            type: "date",
                            display_name: "Not Editable",
                            value: "12/31/2013"
                        }
                    ]
                },
                {
                    display_name: "Dropdown Demo",
                    type: "object",
                    help_message: "Dropdowns can be passed a list of values that the user can pick from",
                    children: [
                        {
                            type: "select",
                            display_name: "Choose your weapon",
                            value: '-1',
                            values: [
                                { name: "Come on pick one!", value: '-1' },
                                { name: "A donkey", value: '0' },
                                { name: "A rubber mallet", value: '1' },
                                { name: "A pea shooter", value: '2' }
                            ],
                            editable: true,
                            actions:[
                                {
                                    type: "update",
                                    uri: "/save_test"
                                }
                            ]
                        },
                        {
                            type: "select",
                            display_name: "Uneditable",
                            value: '2',
                            values: [
                                { name: "Come on pick one!", value: '-1' },
                                { name: "A donkey", value: '0' },
                                { name: "A rubber mallet", value: '1' },
                                { name: "A pea shooter", value: '2' }
                            ]
                        }
                    ]
                },
                {
                    display_name: "Buttons",
                    type: "object",
                    children: [
                        {
                            type: "button",
                            uri: "http://google.com",
                            display_name: "I make a silent request a GET uri"
                        },
                        {
                            type: "button",
                            display_name: "Large blue button with a graph",
                            display: {
                                size: 'large',
                                color: 'blue'
                            },
                            actions: [
                                {
                                    type: "graph",
                                    uri: 'some_uri',
                                    prevent_action_button: false,
                                    prevent_context_menu: false
                                }
                            ]
                        },
                        {
                            type: "button",
                            display: {
                                size: "small",
                                color: "red"
                            },
                            display_name: "Small red button with a quick view",
                            actions: [
                                {
                                    type: "quick_view",
                                    page_type:"object",
                                    uri:"/object_test",
                                    display_name:"View This Object",
                                    prevent_action_button: false,
                                    prevent_context_menu: false
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            display_name: "Pie Charts",
            type: "object",
            children: [
                {
                    display_name: "Small Pie Chart",
                    type: "object",
                    children: [
                        {
                            display_name: "A sample pie chart with size set to small",
                            type: "chart_pie",
                            size: 'small',
                            values: [
                                { name: "This is the first pie slice", value: 200 },
                                { name: "This is the second pie slice", value: 100 },
                                { name: "Third", value: 400 }
                            ]
                        }
                    ]
                },
                {
                    display_name: "Medium Pie Chart",
                    type: "object",
                    children: [
                        {
                            display_name: "A sample pie chart with size set to medium",
                            type: "chart_pie",
                            size: 'medium',
                            values: [
                                { name: "This is the first pie slice", value: 200 },
                                { name: "This is the second pie slice", value: 100 },
                                { name: "Third", value: 400 }
                            ]
                        }
                    ]
                },
                {
                    display_name: "Large Pie Chart",
                    type: "object",
                    children: [
                        {
                            display_name: "A sample pie chart with size set to large",
                            type: "chart_pie",
                            size: 'large',
                            values: [
                                { name: "This is the first pie slice", value: 200 },
                                { name: "This is the second pie slice", value: 100 },
                                { name: "Third", value: 400 }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            display_name: "Bar Charts",
            type: "object",
            children: [
                {
                    display_name: "Small Bar Charts",
                    type: "object",
                    children: [
                        {
                            display_name: "A sample bar chart with size set to small",
                            type: "chart_bar",
                            size: 'small',
                            values: [
                                { name: "Series One", values: [100,200,300,400] },
                                { name: "Series Two", values:[200,100,0,300]}
                            ],
                            x_axis_labels: ['Jan', 'Feb', 'Mar', 'Apr'],
                            value_format_string: "$%d"
                        }
                    ]
                },
                {
                    display_name: "Medium Bar Charts",
                    type: "object",
                    children: [
                        {
                            display_name: "A sample bar chart with size set to medium",
                            type: "chart_bar",
                            size: 'medium',
                            values: [
                                { name: "Series One", values: [100,200,300,400] },
                                { name: "Series Two", values:[200,100,0,300]}
                            ],
                            x_axis_labels: ['Jan', 'Feb', 'Mar', 'Apr'],
                            value_format_string: "$%d"
                        }
                    ]
                },
                {
                    display_name: "Large Bar Charts",
                    type: "object",
                    children: [
                        {
                            display_name: "A sample bar chart with size set to large",
                            type: "chart_bar",
                            size: 'large',
                            values: [
                                { name: "Series One", values: [100,200,300,400] },
                                { name: "Series Two", values:[200,100,0,300]}
                            ],
                            x_axis_labels: ['Jan', 'Feb', 'Mar', 'Apr'],
                            value_format_string: "$%d"
                        }
                    ]
                }
            ]
        },
        {
            display_name: "Network Charts",
            type: "object",
            children: [
                {
                    display_name: "A basic network type chart",
                    type: "object",
                    children: [
                        {
                            display_name: "Network chart using the force render algorithm",
                            type: "chart_network",
                            nodes: [
                                {frequency:1, group: "Project", guid:'', label:"label 0", name: "name 0"},
                                {frequency:0, group: "Person", guid:'', label:"label 1", name: "name 1"},
                                {frequency:0, group: "Person", guid:'', label:"label 2", name: "name 2"}
                            ],
                            links: [
                                {distance: 100, guid:"", source:0, target:1},
                                {distance: 100, guid:"", source:1, target:2},
                                {distance: 100, guid:"", source:0, target:2}
                            ],
                            size: "medium"
                        }
                    ]
                }
            ]
        }
    ]
};

var object_test={
            body: {
                resources:[ real_test_objects],
                trays:[
                    {
                        type: 'draggable_search',
                        icon: 'icon-search',
                        display_name: 'Search Elements'
                    },
                    {
                        type: 'draggable_list',
                        icon: 'icon-edit',
                        display_name: 'Form Elements',
                        help_message: 'You can drag these form elements.',
                        tray_items: [
                            {
                                type: "tray_element",
                                display_name: "A Textbox",
                                icon: "icon-cog"
                            },
                            {
                                type: "tray_element",
                                display_name: "A Text area",
                                icon: "icon-cog"
                            },
                            {
                                type: "tray_element",
                                display_name: "A yes no button collection",
                                icon: "icon-cog"
                            }
                        ]
                    }
                ]
            }
        };
 var dashboard_data = {
            uid: "kwbMXSsBAA9MwKgAxnn9",
            uuri: "object_test", //"/filr/UserProfile.json",
            dashboard: "/resources/services/iList/forms/full.xfrm"
        };

    return {dashboard_data:dashboard_data, object_test:object_test, example_data:example_data, change_state_data:change_state_data, 
            user_data:user_data,
            test_objects: { body: {resources:[ test_objects]}}};

});






