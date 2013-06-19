define([   "js/common.js",  "js/ew_related/transformations.js",   "js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js","js/pipelines/mapper_pipeline_type.js", "js/pipelines/state_step_type.js"],
       function(common,  t,   Foreach_Pipeline,Pipeline, Mapper_Pipeline, StateStep) {
           
           var result={
               init:function(){
                   return new Pipeline(this.name)
                       .addTransformation(t.transformations.init_state_history)
                       .addTransformation(t.transformations.init_footer)
                       .addTransformation(t.transformations.init_header)
                       .addTransformation(t.transformations.init_modals)
                       .addTransformation(t.transformations.load_data)
                       .addTransformation(t.transformations.body_change_state)
                   //TODO add body current_state_is_still_active loop
                   ;
               },
               start:function(){
                   return new Pipeline(this.name)
                       .addTransformation(t.transformations.welcome)
                       .addTransformation(t.transformations.load_data)
                       .addTransformation(new StateStep("prepare_data",function (data_state, callback){
                           $('#left').prepend("<p >preparing data for foreach!</p>");
                           data_state.children_objects=data_state.json.header.children;
                           data_state.accumulator=[];
                           callback(null, data_state);
                       } ))
                       .addPipe(new Foreach_Pipeline("walk_through_children", "children_objects")
                                .addTransformation(t.transformations.generate_uid)
                                .addTransformation(new StateStep("each_child",function (data_state, callback){
                                    $('#left').prepend("<p >child type!"+data_state.current_data.type+"</p>");
                                    callback(null, data_state);
                                } ))
                                .addTransformation(new StateStep("load_tmpl", function(data_state, callback){
                                    var tmpl_name="component_"+data_state.current_data.type;
                                    var html=$.tmpl(tmpl_name, data_state.current_data);
                                    var my_template=$.tmpl('my_template', data_state.current_data);
                                    $(my_template).attr('id', data_state.current_data.id).append(html).append("<div>");
                                    data_state.accumulator.push(my_template);
                                    callback(null, data_state);
                                }))
                               )
                   .addTransformation(new StateStep("paint_results", function(data_state, callback){
                       var container=$("<div></div>");
                       data_state.accumulator.map(function(item){
                           container.append(item);
                       });
                       $('#center').append(container);
                       callback(null, data_state);
                   }))
                   ;
               }
           };

           
           


           
           return common.naming_pipes(result);
       });







