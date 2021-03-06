define([  "js/defines.js",  "js/common.js","js/open_stack/dao.js",  "js/open_stack/query.js","js/open_stack/model.js",   "js/open_stack/ui.js","js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js","js/pipelines/mapper_pipeline_type.js", "js/pipelines/switcher_pipeline_type.js","js/pipelines/state_step_type.js","js/pipelines/dispatcher.js","js/open_stack/events.js","js/open_stack/model/operation.js"],
       function(defines, common, dao, query, model,ui,  Foreach_Pipeline,Pipeline, Mapper_Pipeline,Switcher_Pipeline, StateStep, dispatcher,events, operation_model) {

           

           var result={};
           result.alerta={
               arr: [

                   {item_name_fn:ui.ui_alerta}],
               spec:{
                   type:Pipeline, 
                   params:[]}};


           result.yuhu={
               arr: [
                   {item_name_fn:ui.ui_empty_register_form},
                   {item_name_fn:ui.ui_alerta}],
               spec:{
                   type:Pipeline, 
                   params:[]}};
           result.load_tokens={
               arr:
               [
                   {item_name_fn:query.query_tokens},
                   {item_name_fn:dao.dao}, 
                   {item_name_fn:model.model_store_token_id}], 
               spec:
               {type:Pipeline, params:[]}};
           result.load_tenants={
               arr:
               [{item_name_fn:query.query_tenants},{item_name_fn:dao.dao}, {item_name_fn:model.model_store_tenants}], 
               spec:
               {type:Pipeline, params:[]}};

           result.ok_register={
               arr:
               [
                   {item_name_fn:ui.ui_empty_register_form},
                   {item_name_fn:result.load_tenants},
                   {item_name_fn:ui.ui_select_tenants}
               ],
               spec:
               {type:Pipeline, params:[]}};

           result.load_tenant_selected={
               arr:
               [{item_name_fn:query.query_endpoints},{item_name_fn:dao.dao}, {item_name_fn:model.model_store_endpoints}], 
               spec:
               {type:Pipeline, params:[]}};

           result.load_operation={
               arr:
               [{item_name_fn:query.query_operation},{item_name_fn:dao.dao}, {item_name_fn:model.model_store_operation}], 
               spec:
               {type:Pipeline, params:[]}};


           result.load_servers={
               arr:
               [
                   {item_name_fn:ui.ui_manual_selection, bound:{key:"list", key2:"servers"}},
                   {item_name_fn:result.load_operation}
               ], 
               spec:
               {type:Pipeline, params:[]}};

    result.load_images={
               arr:
               [
                   {item_name_fn:ui.ui_manual_selection, bound:{key:"list", key2:"images"}},
                   {item_name_fn:result.load_operation}
               ], 
               spec:
               {type:Pipeline, params:[]}};
               result.load_flavors={
               arr:
               [
                   {item_name_fn:ui.ui_manual_selection, bound:{key:"list", key2:"flavors"}},
                   {item_name_fn:result.load_operation}
               ], 
               spec:
               {type:Pipeline, params:[]}};
               result.load_networks={
               arr:
               [
                   {item_name_fn:ui.ui_manual_selection, bound:{key:"list", key2:"networks"}},
                   {item_name_fn:result.load_operation}
               ], 
               spec:
               {type:Pipeline, params:[]}};

           result.operation_selected_list={
               arr:
               [

                   //this is done in event dispatcher  {item_name_fn:ui.ui_manual_selection, bound:{key:"list", key2:"servers"}},
                   {item_name_fn:result.load_operation},
                   {item_name_fn:ui.ui_simple_show_operation_selected}
               ], 
               spec:
               {type:Pipeline, params:[]}};

           result.send_create_server={
               arr:
               [
                   {item_name_fn:query.query_create_server},
                   {item_name_fn:dao.dao}, 
                   {item_name_fn:dao.show_result}], 
               spec:
               {type:Pipeline, params:[]}};
   result.send_create_network={
               arr:
               [
                   {item_name_fn:query.query_create_network},
                   {item_name_fn:dao.dao}, 
                   {item_name_fn:dao.show_result}], 
               spec:
               {type:Pipeline, params:[]}};
   result.send_create_subnet={
               arr:
               [
                   {item_name_fn:query.query_create_subnet},
                   {item_name_fn:dao.dao}, 
                   {item_name_fn:dao.show_result}], 
               spec:
               {type:Pipeline, params:[]}};


           result.create_server_options={
               arr:
               [
                   {item_name_fn:ui.ui_manual_selection, bound:{key:"list", key2:"images"}},
                   {item_name_fn:result.load_operation},
                   {item_name_fn:ui.ui_manual_selection, bound:{key:"list", key2:"flavors"}},
                   {item_name_fn:result.load_operation},
                   {item_name_fn:ui.ui_manual_selection, bound:{key:"list", key2:"networks"}},
                   {item_name_fn:result.load_operation},
                   {item_name_fn:ui.ui_create_server_options}
                   
               ], 
               spec:
               {type:Pipeline, params:[]}};
           

           result.create_network_options={
               arr:
               [
                   {item_name_fn:ui.ui_create_network_options}
                   
               ], 
               spec:
               {type:Pipeline, params:[]}};
           result.create_subnet_options={
               arr:
               [
                   {item_name_fn:ui.ui_manual_selection, bound:{key:"list", key2:"networks"}},
                   {item_name_fn:result.load_operation},

                   {item_name_fn:ui.ui_create_subnet_options}
                   
               ], 
               spec:
               {type:Pipeline, params:[]}};

           result.create_options=defines.mapper("operation_selected.hidden",
                                                {"create_server":result.create_server_options,
                                                 "create_network":result.create_network_options,
                                                 "create_subnet":result.create_subnet_options}
                                                
                                               );
           result.operation_selected={
               arr:
               [
                   {item_name_fn: defines.switcher("operation_selected.hidden",
                                                   result.operation_selected_list, 
                                                   result.create_options,
                                                   function(value){return value.indexOf("listing")!=-1;}
                                                  )
                   }
               ], 
               spec:
               {type:Pipeline, params:[]}};

           var resultado=common.naming_pipes(result);

           
           return resultado;
       });







