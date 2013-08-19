define([   "js/common.js","js/open_stack/dao.js",  "js/open_stack/query.js","js/open_stack/model.js",   "js/open_stack/ui.js","js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js","js/pipelines/mapper_pipeline_type.js", "js/pipelines/switcher_pipeline_type.js","js/pipelines/state_step_type.js","js/pipelines/dispatcher.js","js/open_stack/events.js"],
       function(common, dao, query, model,ui,  Foreach_Pipeline,Pipeline, Mapper_Pipeline,Switcher_Pipeline, StateStep, dispatcher,events) {

           var result={
               //Public API

               load:function (){
                   return new Pipeline(this.name)
                       .addTransformation(query.query_operation)
                       .addTransformation(dao.dao)
                       .addTransformation(model.model_store_operation);
                   //TODO in each implementation                    .addTransformation(dao.show_result);
               },


               listing_images: function(){
                   return new Pipeline(this.name)
                   .addTransformation(result.load)
                   .addTransformation(new StateStep("ole", function(data_state, callback){
                       alert(common.toJson(data_state[data_state.operation_selected.hidden]));
                       callback(null, data_state);
                   }))
                   ;}
               // listing_flavors: result.load,
               // listing_networks: result.load,
               // listing_subnets: result.load,
               // listing_servers: result.load
               


           };
           
           


           
           return common.naming_pipes(result,"operation_");
       });







