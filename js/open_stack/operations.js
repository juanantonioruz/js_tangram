define(["js/common.js", "js/pipelines/dispatcher.js"],
       function(common, dispatcher) {

           function customize_operation_data(data_state){
                                                              data_state.data_operation.title=data_state.data_operation.visible;
                                                              data_state.data_operation.url=data_state.data_operation.item.url;
                                                              data_state.data_operation.host=data_state.endpoints[data_state.data_operation.item.service_type];

           }

           var result= {
               show_operation_value_selected:function (data_state, callback){

                   show_message_to_the_user("loading....  "+data_state.action_selected);
                   callback(null, data_state);
                   
               },
              list_images:function (data_state, callback){
                  data_state.data_operation= {item:{service_type:"nova", url:"/images"}, visible:"LIST IMAGES", hidden:'images'};
                  customize_operation_data(data_state);
                   callback(null, data_state);
               },
              list_flavors:function (data_state, callback){
                  data_state.data_operation= {item:{service_type:"nova", url:"/flavors"}, visible:"LIST FLAVORS", hidden:"nova-flavors"};
                  customize_operation_data(data_state);
                   callback(null, data_state);
               },
              list_networks:function (data_state, callback){
                  data_state.data_operation= {item:{service_type:"quantum", url:"/v2.0/networks"}, visible:"LIST NETWORKS", hidden:"quantum-networks"};
                  customize_operation_data(data_state);
                   callback(null, data_state);
               },
              list_subnets:function (data_state, callback){
                  data_state.data_operation= {item:{service_type:"quantum", url:"/v2.0/subnets"}, visible:"LIST SUBNETS", hidden:"quantum-subnets"};
                  customize_operation_data(data_state);
                   callback(null, data_state);
               },
              list_servers:function (data_state, callback){
                  data_state.data_operation= {item:{service_type:"nova", url:"/servers"}, visible:"LIST SERVERS", hidden:"nova-servers"};
                  customize_operation_data(data_state);
                   callback(null, data_state);
               }



           };

           return common.naming_fns(result);







       });
