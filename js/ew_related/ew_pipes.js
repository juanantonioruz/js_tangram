define([  "js/ew_related/ew_ow_pipes.js", "js/pipelines/dispatcher.js",  "js/common.js",  "js/ew_related/transformations.js",   "js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js","js/pipelines/mapper_pipeline_type.js","js/pipelines/switcher_pipeline_type.js", "js/pipelines/state_step_type.js"],
       function(object_viewer_pipes, dispatcher, common,  t,   Foreach_Pipeline,Pipeline, Mapper_Pipeline,Switcher_Pipeline, StateStep) {
console.dir(object_viewer_pipes.render_children());
           var result={
      render_object_viewer:function(){
                   return new Pipeline(this.name)
                       .addTransformation(t.update.body_current_state_display_name)
                       .addTransformation(t.templates.load_object_viewer)
                       .addTransformation(t.cache_data.object_viewer)

                       .addPipe(new Switcher_Pipeline("resource_header", 
                                                function switcher(_value){
                                                    switch(_value){
                                                    case null:
                                                        // alpha , in future it must became pipeline definitio
                                                        return t.templates.load_object_viewer_without_header;
                                                        break;
                                                    default:
                                                        return result.render_object_viewer_with_header;
                                                        break;
                                                    };
                                                }, 
                                                "resource.header"))
                       .addPipe(object_viewer_pipes.render_children)
                   ;
               }
,
                    render_pages_main:function(){
                   return new Pipeline(this.name)

                       .addTransformation(t.renders.activity_list)
                       .addTransformation(t.renders.clean_trays)
                        .addTransformation(t.update.loading_object_editor)
                       .addTransformation(t.dao.load_pages_main_data)
                       .addTransformation(t.renders.trays)
                            .addPipe(result.render_object_viewer)
                   ;
               },
               render_page_body:function(){
                   return new Pipeline(this.name)

                       .addTransformation(t.cache_data.page_body)

                       .addPipe(new Mapper_Pipeline("page_type", 
                                              {"task": t.renders.task,
                                               "object":result.render_pages_main}, 
                                              "change_state_data.page_type"))
                   
//                       .throw_event_on_success("body_change_state")
                   ;

               },

               render_body:function(){
                   return ;
               },
               
               body_change_state:function(){
                   return new Pipeline(this.name)

                       .addTransformation(t.modals.close)
                       .addTransformation(t.state_history.prepare)
                       .addPipe(new Mapper_Pipeline("state", 
                                              {"modal":result.render_modal,
                                               "object_view":result.render_page_body}, 
                                              "change_state_data.state"))
                       .addTransformation(t.transformations.footer_update_breadcrumbs)                   
//                       .throw_event_on_success("body_change_state")
                   ;
               }
               ,

               init:function(){
                   return new Pipeline(this.name)
                       .addTransformation(t.state_history.init)
                       .addTransformation(t.renders.footer)
                       .addTransformation(t.renders.header)
                       .addTransformation(t.modals.init)
                       .addTransformation(t.dao.load_dashboard_data)
//                       .addTransformation(t.transformations.body_change_state)
                   // i am proposing this tecnique of throwing an event-domain-name on "end" pipe to improve EOP... not always using on_end event, that doesn mean anyting more, and in this case we are inside of an "init" pipeline that doesn't mean nothing niether
                       .throw_event_on_success("body_change_state")
                   //TODO add body current_state_is_still_active loop... it could be a parallel pipeline
                   ;
               },
               render_modal:function(){
                   return new Pipeline(this.name)
                       .addTransformation(t.renders.modal);
               },
              
               walk_object_viewer_header_children:function(){
                   return new Foreach_Pipeline(this.name, "resource.header.children")


                       .addTransformation(t.templates.load_object_viewer_child)
                       .addTransformation(t.cache_data.object_viewer_header_child)

                   


                     .addPipe(object_viewer_pipes.render_component)
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
           
           return common.naming_pipes(result);
       });




