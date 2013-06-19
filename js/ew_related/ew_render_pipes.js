define([   "js/common.js",  "js/ew_related/transformations.js",   "js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js","js/pipelines/mapper_pipeline_type.js", "js/pipelines/state_step_type.js"],
       function(common,  t,   Foreach_Pipeline,Pipeline, Mapper_Pipeline, StateStep) {
           
           var result={
               render_modal:function(){
                   return new Pipeline(this.name)
                       .addTransformation(t.renders.modal);
               },
               render_pages_main:function(){
                   return new Pipeline(this.name)
                       .addTransformation(t.renders.pages_main)
                       .addTransformation(t.renders.activity_list)
                       .addTransformation(t.renders.trays);

               },
               page_body_page_type:function(){
                   return new Mapper_Pipeline(this.name, 
                                              {"task": t.renders.task,
                                               "object":result.render_pages_main}, 
                                              "page_type");
               },
               render_page_body:function(){
                   return new Pipeline(this.name)
                       .addTransformation(t.renders.page_body)
                       .addPipe(result.page_body_page_type)
                   ;
               }
        
               
           };

           
           


           
           return common.naming_pipes(result);
       });







