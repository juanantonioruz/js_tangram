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
                                                    return /*t.component.object;*/c.render_object_object;

                                                    else
                                                        return t.component.generic;
                                                    
                                                }, 
                                                "current_data.type");
  
               },
               
               render_component:function(){
                   return new Pipeline(this.name)
                       .addTransformation(t.component.generate_uid)
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
                   
               },
                  walk_children:function(){
                   return new Foreach_Pipeline(this.name, "current_data.children")
                       .addTransformation(t.templates.load_object_object_child)
                       .addPipe(c.render_component)


                   ;
               },
               render_object_object:function(){
                   return new Pipeline(this.name)
                       .addTransformation(t.templates.load_object_object)                      
                       .addPipe(new Switcher_Pipeline("has_children", 
                                                      function switcher(_value){
                                                          if(_value!=null && _value.length!=null)
                                                              return c.walk_children;
                                                          else
                                                              return t.transformations.debug;
                                                      }, 
                                                      "current_data.children",function(_value){
                                                          if(_value!=null && _value.length!=null) return "collection";
                                                          else return "null";
                                                          
                                                      }))
                   ;

               }
           };




           return common.naming_pipes(c);
       });




