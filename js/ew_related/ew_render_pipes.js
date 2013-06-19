define([   "js/common.js",  "js/ew_related/transformations.js",   "js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js","js/pipelines/mapper_pipeline_type.js", "js/pipelines/state_step_type.js"],
       function(common,  t,   Foreach_Pipeline,Pipeline, Mapper_Pipeline, StateStep) {
           
           var result={
               render_modal:function(){
                   return new Pipeline(this.name)
                       .addTransformation(t.renders.modal);
               },
               render_page_body:function(){
                   return new Pipeline(this.name)
                       .addTransformation(t.renders.page_body);
               }
        
               
           };

           
           


           
           return common.naming_pipes(result);
       });







