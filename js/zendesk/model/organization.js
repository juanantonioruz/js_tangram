define(["js/common.js","js/open_stack/events.js", "js/pipelines/dispatcher.js", "js/zendesk/model/info_type.js","js/zendesk/model/data_type.js"],
       function(common, events, dispatcher, i_type, d_type) {
           function define_data(info_type_key, data_type_key){
               return {info_type:i_type[info_type_key].key, data_type:d_type[data_type_key].key};
           };
         
           var schema={

               "id": define_data("id", "numeric"),
               "url": define_data("url", "url"),
               "name": define_data("human", "string")
        //        "shared_tickets": false,
        // "shared_comments": false,
        // "external_id": null,
        // "created_at": "2013-08-26T15:59:31Z",
        // "updated_at": "2013-08-27T18:53:51Z",
        // "domain_names": [
        //     "enjava.com"
        // ],
        // "details": "",
        // "notes": "",
        // "group_id": null,
        // "tags": [],
        // "organization_fields": {}
    };
           function analyse(){
               var the_data_analysed={human:[]};
               console.dir(schema);
               Object.keys(schema).map(function(item){
               schema[item].key=item;
                   if(schema[item] && schema[item].toString()=="[object Object]"){
                       var info_type=schema[item].info_type;
                       if(info_type==i_type.id.key)
                           the_data_analysed.id=item;

                       if(info_type==i_type.human_id.key)
                           the_data_analysed.human_id=item;


                       if(info_type==i_type.human.key)
                           the_data_analysed.human.push({key:item, type:schema[item].data_type});




                   }

               });
               console.dir(the_data_analysed);

               return the_data_analysed;
           };


           var result={
               model_name:"organization",
               data_state_store_selected_key:"organization_selected_id",
               data_state_store_selected_user:"organization_selected_load",
               data_state_store_user_on_editing:"organization_on_editing",
               data_state_key:"organizations",
               
               raw:schema,
               data:analyse()
           };
           

           return result;
       }
      );
