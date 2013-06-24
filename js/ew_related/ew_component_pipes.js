define([   "js/pipelines/dispatcher.js",  "js/common.js",  "js/ew_related/transformations.js",   "js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js","js/pipelines/mapper_pipeline_type.js","js/pipelines/switcher_pipeline_type.js", "js/pipelines/state_step_type.js"],
       function(dispatcher, common,  t,   Foreach_Pipeline,Pipeline, Mapper_Pipeline,Switcher_Pipeline, StateStep) {

           var c={

               render_component:function(){
                   return new Pipeline(this.name)
                       .addTransformation(t.transformations.generate_uid)
                       .addTransformation(t.load_tmpl.component)
                       .addPipe(c.render_validation)

                       .addTransformation(t.actions.component_a)
                       .addTransformation(t.metadata.component_m)
                   ;
                   
                   
               },
               render_validation:function(){
                   return new Pipeline(this.name)
                       .addTransformation(t.validation.key_up)
                       .addTransformation(t.validation.click)
                       .addTransformation(t.validation.is_phone_number)
                       .addTransformation(t.validation.is_date)
                       .addTransformation(t.validation.is_mail)
                   ;
                   
               }
           };
           return common.naming_pipes(c);
       });




