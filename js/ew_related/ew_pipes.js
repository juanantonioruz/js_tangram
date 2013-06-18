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
                                .addTransformation(new StateStep("each child",function (data_state, callback){
                                    $('#center').prepend("<h3 >child type!"+data_state.current_data.type+"</h3>");
                                    callback(null, data_state);
                                } ))
                               )
                   ;
               }
           };

           
           


           
           return common.naming_pipes(result);
       });







