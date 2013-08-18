define(["js/common.js", "js/pipelines/dispatcher.js"],
       function(common, dispatcher) {

           function customize_operation_data(data_state){
                                                              data_state.data_operation.title=data_state.data_operation.visible;
                                                              data_state.data_operation.url=data_state.data_operation.item.url;
                                                              data_state.data_operation.host=data_state.endpoints[data_state.data_operation.item.service_type];

           }

           var result= {
              

           };

           return common.naming_fns(result, "tenant_");







       });
