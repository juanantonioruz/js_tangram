define(["js/common.js","js/open_stack/events.js", "js/pipelines/dispatcher.js"],
       function(common, events, dispatcher, i_type, d_type) {
           
         
           var schema={

               "id": common.define_data("id", "numeric"),
               "url": common.define_data("url", "url"),
               "name": common.define_data("human_id", "string"),
        //        "shared_tickets": false,
        // "shared_comments": false,
        // "external_id": null,
        // "created_at": "2013-08-26T15:59:31Z",
        // "updated_at": "2013-08-27T18:53:51Z",
        // "domain_names": [
        //     "enjava.com"
        // ],
               "details": common.define_data("human", "string"),
               "notes": common.define_data("human", "string")

        // "group_id": null,
        // "tags": [],
        // "organization_fields": {}
    };
          


           var result={
               model_name:"organization",
               data_state_store_selected_key:"organization_selected_id",
               data_state_store_selected_object:"organization_selected_load",
               data_state_store_object_on_editing:"organization_on_editing",
               data_state_key:"organizations",
               
               raw:schema,
               data:common.analyse_data(schema)
           };
           

           return result;
       }
      );
