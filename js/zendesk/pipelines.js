define([  "js/defines.js",  "js/common.js","js/open_stack/dao.js",  "js/zendesk/query.js",  "js/zendesk/ui.js","js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js","js/pipelines/mapper_pipeline_type.js", "js/pipelines/switcher_pipeline_type.js","js/pipelines/state_step_type.js","js/pipelines/dispatcher.js","js/open_stack/events.js", "js/zendesk/model.js"],
       function(defines, common, dao, query, ui,  Foreach_Pipeline,Pipeline, Mapper_Pipeline,Switcher_Pipeline, StateStep, dispatcher,events, model) {

           

           var result={};
           
           result.try_to_log={
               arr:
               [
                   {item_name_fn:query.query_base, bound:{"query":"profile"}},
                   {item_name_fn:dao.dao},
                   {item_name_fn:model.model_load_profile}

               ],
               spec:
               {type:Pipeline, params:[]}};
           
           result.show_organizations={
               arr:
               [
                   {item_name_fn:query.query_base, bound:{"query":"organizations"}},
                   {item_name_fn:dao.dao},
                   {item_name_fn:model.model_load_organizations}

               ],
               spec:
               {type:Pipeline, params:[]}};


    result.show_tickets={
               arr:
               [
                   {item_name_fn:query.query_base, bound:{"query":"tickets"}},
                   {item_name_fn:dao.dao},
                    {item_name_fn:model.model_load_base, bound:{key:"tickets", dao_key:"tickets"}},
                   {item_name_fn:ui.ui_simple_show, bound: {key:"tickets"}}

               ],
               spec:
               {type:Pipeline, params:[]}};

           var resultado=common.naming_pipes(result);

           
           return resultado;
       });







