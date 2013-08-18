define(["js/common.js", "js/pipelines/dispatcher.js"],
       function(common, dispatcher) {

           var result= {
               name:"tenants",
               dao_requirements:["ip", "token_id"],
               data_state_key:"tenants_select",
               instanciate_container:function(data_state){
                   data_state[result.data_state_key]=[];
                   return result.get_model(data_state);
               },
               populate_container:function(data_state, dao_result){
                   dao_result.tenants.map(function(item){
                       data_state[result.data_state_key].push({hidden:item.name, visible:item.name, item:item});
                   });
               },
               get_model:function(data_state){
                   return data_state[result.data_state_key];
               },
              get_selected_name:function(data_state){
                  return data_state.tenant_name;
              },
               set_selected:function(data_state, item){
                   data_state.tenant_name=item.name;
                   data_state.tenant_id=item.id;
               },
               example_single_tenant_ajax_response:{
                   "hidden": "demo",
                   "visible": "demo",
                   "item": {
                       "description": null,
                       "enabled": true,
                       "id": "e456641efca44f989f3fe8158757c788",
                       "name": "demo"
                   }
               }

           };

           return result;







       });
