define([   "js/pipelines/dispatcher.js",  "js/common.js",  "js/ew_related/transformations.js",   "js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js","js/pipelines/mapper_pipeline_type.js","js/pipelines/switcher_pipeline_type.js", "js/pipelines/state_step_type.js"],
       function(dispatcher, common,  t,   Foreach_Pipeline,Pipeline, Mapper_Pipeline,Switcher_Pipeline, StateStep) {

           var c={
               text_component:function(){
                   return new Pipeline(this.name)
                       .addTransformation(t.component.text)

                   ;
               },
               switch_component:function(){
                                    return new Switcher_Pipeline(this.name, 
                                                function switcher(_value){
                                                    if(_value=="image")
                                                    return t.component.image;
                                                      else if(_value=="text")
                                                    return c.text_component;
                                                      else if(_value=="object")
                                                    return t.component.object;

                                                    else
                                                        return t.transformations.component;
                                                    
                                                }, 
                                                "current_data.type");
  
               },
               
               render_component:function(){
                   return new Pipeline(this.name)
                       .addTransformation(t.transformations.generate_uid)
                       .addTransformation(c.switch_component)
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




