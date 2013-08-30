define([  "js/defines.js",  "js/common.js","js/dao/dao"+this.debug_value+".js",  "js/zendesk/query.js",  "js/zendesk/ui.js","js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js","js/pipelines/mapper_pipeline_type.js", "js/pipelines/switcher_pipeline_type.js","js/pipelines/state_step_type.js","js/pipelines/dispatcher.js","js/open_stack/events.js", "js/zendesk/model.js"],
       function(defines, common, dao, query, ui,  Foreach_Pipeline,Pipeline, Mapper_Pipeline,Switcher_Pipeline, StateStep, dispatcher,events, model) {

           

           var result={};
           
           result.try_to_log={
               arr:
               [
                   {item_name_fn:ui.inject_reg_values},
                   {item_name_fn:query.query_base, bound:{"query":"profile"}},
                   {item_name_fn:dao.dao},
                   {item_name_fn:model.model_load_profile} // the first user is the admin

               ],
               spec:
               {type:Pipeline, params:[]}};
           

           result.show_users={
               arr:
               [
                   {item_name_fn:query.query_base, bound:{"query":"users"}},
                   {item_name_fn:dao.dao},
                   {item_name_fn:model.model_load_base, bound:{key:"users", dao_key:"users"}},
                   {item_name_fn:ui.simple_show, bound: {key:"users"}},
                   {item_name_fn:ui.show_select_users}

               ],
               spec:
               {type:Pipeline, params:[]}};

           result.load_organizations={
               arr:
               [
                   {item_name_fn:query.query_base, bound:{"query":"organizations"}},
                   {item_name_fn:dao.dao},
                   {item_name_fn:model.model_load_base, bound:{key:"organizations", dao_key:"organizations"}}



               ],
               spec:
               {type:Pipeline, params:[]}};

           result.show_organizations={
               arr:
               [
                   {item_name_fn:result.load_organizations},
                   {item_name_fn:ui.show_select_orgs}



               ],
               spec:
               {type:Pipeline, params:[]}};


           result.show_tickets={
               arr:
               [
                   {item_name_fn:query.query_base, bound:{"query":"tickets"}},
                   {item_name_fn:dao.dao},
                   {item_name_fn:model.model_load_base, bound:{key:"tickets", dao_key:"tickets"}},
                   {item_name_fn:ui.simple_show, bound: {key:"tickets"}},
                   {item_name_fn:ui.show_select_tickets}

               ],
               spec:
               {type:Pipeline, params:[]}};

           result.show_groups={
               arr:
               [
                   {item_name_fn:query.query_base, bound:{"query":"groups"}},
                   {item_name_fn:dao.dao},
                   {item_name_fn:model.model_load_base, bound:{key:"groups", dao_key:"groups"}},
                   {item_name_fn:ui.simple_show, bound: {key:"groups"}}

               ],
               spec:
               {type:Pipeline, params:[]}};
           result.show_topics={
               arr:
               [
                   {item_name_fn:query.query_base, bound:{"query":"topics"}},
                   {item_name_fn:dao.dao},
                   {item_name_fn:model.model_load_base, bound:{key:"topics", dao_key:"topics"}},
                   {item_name_fn:ui.simple_show, bound: {key:"topics"}}

               ],
               spec:
               {type:Pipeline, params:[]}};


           var resultado=common.naming_pipes(result);

           
           return resultado;
       });







