define([   "js/common.js",  "js/ew_related/transformations.js",   "js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js","js/pipelines/mapper_pipeline_type.js", "js/pipelines/state_step_type.js"],
       function(common,  transformations,   Foreach_Pipeline,Pipeline, Mapper_Pipeline, StateStep) {
           
           var result={
               start:function(){
                   return new Pipeline(this.name)
                       .addTransformation(transformations.welcome)
                       .addTransformation(transformations.load_data)
                       .addTransformation(new StateStep("prepare_data",function (data_state, callback){
                           $('#center').prepend("<h3 >preparing data for foreach!</h3>");
                           data_state.children_objects=data_state.json.header.children;
                           callback(null, data_state);
                       } ))
                       .addPipe(new Foreach_Pipeline("walk_through_children", "children_objects")
                                .addTransformation(transformations.generate_uid)
                                .addTransformation(new StateStep("each_child",function (data_state, callback){
                                    $('#center').prepend("<h3 >child type!"+data_state.current_data.type+"</h3>");
                                    callback(null, data_state);
                                } ))
                                .addTransformation(new StateStep("load_tmpl", function(data_state, callback){
                                    var tmpl_name="component_"+data_state.current_data.type;
                                    var html=$.tmpl(tmpl_name, data_state.current_data);
                                    var my_template=$.tmpl('my_template', data_state.current_data);
                                    $(my_template).attr('id', data_state.current_data.id).append(html);
                                    $('#left').append(my_template);
                                    callback(null, data_state);
                                }))
                               )
                   ;
               }
           };

           
           


           
           return common.naming_pipes(result);
       });







