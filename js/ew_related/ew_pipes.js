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
               render_object_viewer_header:function(){
                   return new Switcher_Pipeline(this.name, 
                                                function switcher(_value){
                                                    switch(_value){
                                                    case null:
                                                        return t.templates.load_object_viewer_without_header;
                                                        break;
                                                    default:
                                                        return t.templates.load_object_viewer_with_header;
                                                        break;
                                                    };
                                                }, 
                                                "resource.header");
                   
               },
               walk_children:function(){
                   return new Foreach_Pipeline(this.name, "resource.children")
                       .addTransformation(t.transformations.generate_uid)
                       .addTransformation(new StateStep("load_tmpl", function(data_state, callback){
                           var tmpl_name="component_"+data_state.current_data.type;
                           var html=$.tmpl(tmpl_name, data_state.current_data);
                           var my_template=$.tmpl('my_template', data_state.current_data);
                           $(my_template).attr('id', data_state.current_data.id).append(html).append("<div>");

                           callback(null, data_state);
                       }))
                   ;
               },
               render_object_viewer:function(){
                   return new Pipeline(this.name)
                       .addTransformation(t.update.body_current_state_display_name)
                       .addTransformation(t.templates.load_object_viewer)
                       .addTransformation(t.cache_data.object_viewer)
                       .addPipe(result.render_object_viewer_header)
                       .addPipe(result.walk_children)
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




// start:function(){
//     return new Pipeline(this.name)
//         .addTransformation(t.transformations.welcome)
//         .addTransformation(t.transformations.load_data)
//         .addTransformation(new StateStep("prepare_data",function (data_state, callback){
//             $('#left').prepend("<p >preparing data for foreach!</p>");
//             data_state.children_objects=data_state.json.header.children;
//             data_state.accumulator=[];
//             callback(null, data_state);
//         } ))
//         .addPipe(new Foreach_Pipeline("walk_through_children", "children_objects")
//                  .addTransformation(t.transformations.generate_uid)
//                  .addTransformation(new StateStep("each_child",function (data_state, callback){
//                      $('#left').prepend("<p >child type!"+data_state.current_data.type+"</p>");
//                      callback(null, data_state);
//                  } ))
//                  .addTransformation(new StateStep("load_tmpl", function(data_state, callback){
//                      var tmpl_name="component_"+data_state.current_data.type;
//                      var html=$.tmpl(tmpl_name, data_state.current_data);
//                      var my_template=$.tmpl('my_template', data_state.current_data);
//                      $(my_template).attr('id', data_state.current_data.id).append(html).append("<div>");
//                      data_state.accumulator.push(my_template);
//                      callback(null, data_state);
//                  }))
//                 )
//         .addTransformation(new StateStep("paint_results", function(data_state, callback){
//             var container=$("<div></div>");
//             data_state.accumulator.map(function(item){
//                 container.append(item);
//             });
//             $('#center').append(container);
//             callback(null, data_state);
//         }))
//     ;
// }





