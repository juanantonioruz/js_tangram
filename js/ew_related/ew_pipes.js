define([   "js/common.js",  "js/ew_related/transformations.js",   "js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js","js/pipelines/mapper_pipeline_type.js","js/pipelines/switcher_pipeline_type.js", "js/pipelines/state_step_type.js"],
       function(common,  t,   Foreach_Pipeline,Pipeline, Mapper_Pipeline,Switcher_Pipeline, StateStep) {

           var result={
               
               render_mapper:function(){
                   return new Mapper_Pipeline(this.name, 
                                              {"modal":result.render_modal,
                                               "object_view":result.render_page_body}, 
                                              "view_type");
               },
               init:function(){
                   return new Pipeline(this.name)
                       .addTransformation(t.state_history.init)
                       .addTransformation(t.renders.footer)
                       .addTransformation(t.renders.header)
                       .addTransformation(t.modals.init)
                       .addTransformation(t.dao.load_dashboard_data)


                       .addTransformation(t.transformations.body_change_state)




                   //TODO add body current_state_is_still_active loop... it could be a parallel pipeline
                   ;
               },
               render_modal:function(){
                   return new Pipeline(this.name)
                       .addTransformation(t.renders.modal);
               },
               render_component:function(){
                   return new Pipeline(this.name)
                       .addTransformation(t.transformations.generate_uid)
                  //     .addTransformation(t.load_tmpl.component)
                   //                       .addPipe(result.render_validation)
                   //                        .addTransformation(t.validation.key_up)
                   //                      .addTransformation(t.validation.click)
                   //                     .addTransformation(t.validation.is_phone_number)
                   //                   .addTransformation(t.validation.is_date)
                   //    .addTransformation(t.validation.is_mail)

                    //   .addTransformation(t.actions.component_a)
                     //  .addTransformation(t.metadata.component_m)
                   ;
                   
                   
               },
               walk_object_viewer_header_children:function(){
                                      return new Foreach_Pipeline(this.name, "resource.header.children")


                    .addTransformation(t.templates.load_object_viewer_child)
                    .addTransformation(t.cache_data.object_viewer_header_child)

                   
                       // .addTransformation(t.transformations.generate_uid)
                       // .addTransformation(t.load_tmpl.component)
                       // .addTransformation(t.validation.is_mail)


                                       .addPipe(result.render_component)
                   ;
               },
               render_object_viewer_header_children_bis:function(){
                   return new Switcher_Pipeline(this.name, 
                                                function switcher(_value){
                                                    if(typeof(_value)==='function')
                                                        return t.templates.object_viewer_header_function;
                                                    else
                                                        return result.walk_object_viewer_header_children;

                                                }, 
                                                "resource.header.children");
                   
               },
               render_object_viewer_header_children:function(){
                   return new Switcher_Pipeline(this.name, 
                                                function switcher(_value){
                                                    if(_value!=null && _value.length>0)
 //                                                      return result.walk_object_viewer_header_children;
                                                   return result.render_object_viewer_header_children_bis;
                                                    else
                                                        return t.templates.object_viewer_header_error;
                                                    
                                                }, 
                                                "resource.header.children");
                   
               },
               render_object_viewer_with_header:function(){
                   return new Pipeline(this.name)
                       .addTransformation(t.templates.load_object_viewer_with_header)
                       .addTransformation(t.cache_data.object_viewer_header)
                       .addTransformation(t.templates.configure_object_viewer_header)
                       .addTransformation(t.relationships.object_viewer_header)
                       .addPipe(result.render_object_viewer_header_children)
                   ;
               },
               render_object_viewer_header:function(){
                   return new Switcher_Pipeline(this.name, 
                                                function switcher(_value){
                                                    switch(_value){
                                                    case null:
                                                        return t.templates.load_object_viewer_without_header;
                                                        break;
                                                    default:
                                                        return result.render_object_viewer_with_header;
                                                        break;
                                                    };
                                                }, 
                                                "resource.header");
                   
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
                   return new Foreach_Pipeline(this.name, "resource.children")
                       .addPipe(result.render_component)

                   ;
               },
               render_object_viewer:function(){
                   return new Pipeline(this.name)
                       .addTransformation(t.update.body_current_state_display_name)
                       .addTransformation(t.templates.load_object_viewer)
                       .addTransformation(t.cache_data.object_viewer)

                     .addPipe(result.render_object_viewer_header)
                     //  .addPipe(result.walk_children)
                   ;
               },

               render_pages_main:function(){
                   return new Pipeline(this.name)
                       .addTransformation(t.renders.pages_main)
                       .addTransformation(t.renders.activity_list)
                      .addTransformation(t.renders.clean_trays)
                      .addTransformation(t.dao.load_pages_main_data)
                      .addPipe(result.render_object_viewer)
                   ;
               },
               page_body:function(){
                   return new Mapper_Pipeline(this.name, 
                                              {"task": t.renders.task,
                                               "object":result.render_pages_main}, 
                                              "page_type");
               },
               render_page_body:function(){
                   return new Pipeline(this.name)
                       .addTransformation(t.renders.page_body)
                       .addPipe(result.page_body)
                   ;
               }
               
           };
           
           return common.naming_pipes(result);
       });




