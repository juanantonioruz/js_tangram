define([  "js/defines.js",  "js/common.js","js/open_stack/dao.js",  "js/open_stack/query.js","js/open_stack/model.js",   "js/open_stack/ui.js","js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js","js/pipelines/mapper_pipeline_type.js", "js/pipelines/switcher_pipeline_type.js","js/pipelines/state_step_type.js","js/pipelines/dispatcher.js","js/open_stack/events.js","js/open_stack/model/operation.js"],
       function(defines, common, dao, query, model,ui,  Foreach_Pipeline,Pipeline, Mapper_Pipeline,Switcher_Pipeline, StateStep, dispatcher,events, operation_model) {

    

           var result={};


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
           var resultado=common.naming_pipes(result);

          
           return resultado;
       });







