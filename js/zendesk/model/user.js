define(["js/common.js","js/open_stack/events.js", "js/pipelines/dispatcher.js", "js/zendesk/model/info_type.js","js/zendesk/model/data_type.js"],
       function(common, events, dispatcher, i_type, d_type) {
           function define_data(info_type_key, data_type_key){
               return {info_type:i_type[info_type_key], data_type:d_type[data_type_key]};
           };
           var user_schema={
               "id": define_data("id", "numeric"),
               "url": define_data("url", "url"),
               "name": define_data("human", "string"),
               "created_at": define_data("created", "date"),
               "updated_at": define_data("updated", "date"),
               "time_zone":  define_data("time_zone", "string"),
               "email": define_data("human_id", "email")
               // "phone": null,
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
           
           function analyse(){
               var the_data_analysed={};
               Object.keys(user_schema).map(function(item){
                   if(user_schema[item] && user_schema[item].toString()=="[object Object]"){
                       var info_type=user_schema[item].info_type;
                       if(info_type==i_type.id)
                           the_data_analysed.id=item;


                       if(info_type==i_type.human_id)
                           the_data_analysed.human_id=item;


                   }

               });
               return the_data_analysed;
           };


           var result={
               model_name:"user",
               data_state_store_selected_key:"user_selected_id",
               data_state_store_selected_user:"user_selected_load",
               data_state_key:"users",
               
               raw:user_schema,
               data:analyse()
           };
           

           return result;
       }
      );
