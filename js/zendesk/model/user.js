define(["js/common.js","js/open_stack/events.js", "js/pipelines/dispatcher.js"],
       function(common, events, dispatcher) {
        
           var user_schema={
               "id": common.define_data("id", "numeric"),
               "url": common.define_data("url", "url"),
               "name": common.define_data("human", "string"),
               "created_at": common.define_data("created", "date"),
               "updated_at": common.define_data("updated", "date"),
               "time_zone":  common.define_data("time_zone", "string"),
               "email": common.define_data("human_id", "email"),
               "phone":common.define_data("human", "string")
               // "photo": null,
               // "locale_id": 1,
               // "locale": "en-US",
               // "organization_id": 28070998,
               // "role": "admin",
               // "verified": true,
               // "external_id": null,
               // "tags": [],
               // "alias": "",
               // "active": true,
               // "shared": false,
               // "shared_agent": false,
               // "last_login_at": "2013-08-28T04:04:19-05:00",
               // "signature": "",
               // "details": "",
               // "notes": "",
               // "custom_role_id": null,
               // "moderator": true,
               // "ticket_restriction": null,
               // "only_private_comments": false,
               // "restricted_agent": false,
               // "suspended": false,
               // "user_fields": {}
           };
           
           


           var result={
               model_name:"user",
               data_state_store_selected_key:"user_selected_id",
               data_state_store_selected_object:"user_selected_load",
               data_state_store_object_on_editing:"user_on_editing",
               data_state_key:"users",
               
               raw:user_schema,
               data:common.analyse_data(user_schema)
           };
           

           return result;
       }
      );
