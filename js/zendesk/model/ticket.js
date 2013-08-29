define(["js/common.js","js/open_stack/events.js", "js/pipelines/dispatcher.js"],
       function(common, events, dispatcher, i_type, d_type) {
           
         
           var schema={

               "id": common.define_data("id", "numeric"),
               "url": common.define_data("url", "url"),

               // "external_id":      "ahg35h3jh",
               // "created_at":       "2009-07-20T22:55:29Z",
               // "updated_at":       "2011-05-05T10:38:52Z",
               // "type":             "incident",
               "subject": common.define_data("human_id", "string")

               // "subject":          "Help, my printer is on fire!",
               // "description":      "The fire is very colorful.",
               // "priority":         "high",
               // "status":           "open",
               // "recipient":        "support@company.com",
               // "requester_id":     20978392,
               // "submitter_id":     76872,
               // "assignee_id":      235323,
               // "organization_id":  509974,
               // "group_id":         98738,
               // "collaborator_ids": [35334, 234],
               // "forum_topic_id":   72648221,
               // "problem_id":       9873764,
               // "has_incidents":    false,
               // "due_at":           null,
               // "tags":             ["enterprise", "other_tag"],
               // "via": {
               //     "channel": "web"
               // },
               // "custom_fields": [
               //     {
               //         "id":    27642,
               //         "value": "745"
               //     },
               //     {
               //         "id":    27648,
               //         "value": "yes"
               //     }
               // ],
               // "satisfaction_rating": {
               //     "id": 1234,
               //     "score": "good",
               //     "comment": "Great support!"
               // },
               // "sharing_agreement_ids": [84432]
           };
          


           var result={
               model_name:"ticket",
               data_state_store_selected_key:"ticket_selected_id",
               data_state_store_selected_object:"ticket_selected_load",
               data_state_store_object_on_editing:"ticket_on_editing",
               data_state_key:"tickets",
               
               raw:schema,
               data:common.analyse_data(schema)
           };
           

           return result;
       }
      );
