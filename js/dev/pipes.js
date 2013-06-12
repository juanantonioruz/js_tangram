define(["js/dev/fns.js","js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js","js/pipelines/mapper_pipeline_type.js"],
       function(fns,Foreach_Pipeline,Pipeline, Mapper_Pipeline) {
           var result= {
               good_morning_and_good_afternoon:function(){
                       return new Pipeline("good_morning_and_noon")
                           .addTransformation( fns.good_morning_fn)
                           .addTransformation( fns.good_afternoon_fn);
                   
               },

               good_night:function(){
                   return   new Pipeline("good_night")
                       .addTransformation( fns.good_night_fn);
                   
               },

               
               good_morning_and_good_afternoon_mapper:function(){

                   var ey= function(){
                       return new Pipeline("good_morning_and_noon")
                           .addTransformation( fns.good_morning_fn)
                           .addTransformation( fns.good_afternoon_fn);
                   };
                   var ay= function(){
                       return new Pipeline("ay")
                           .addTransformation( fns.good_night_fn);};
                   return  new Mapper_Pipeline("choose_hour", {true:ey, false:ay}, "mapper_condition_example");


               },
               active_gn_button:function(){
                   return new Pipeline("active_gn_button").
                       addTransformation( fns.active_gn_button);
               },
               day_and_night:function(){
                         
                  return  new Pipeline("day_and_night")
                          .addPipe(result.good_morning_and_good_afternoon()).addPipe(result.good_night());
               


               },
              parallel_example:function(){
                  return new Pipeline("parallel_example")
                      .addPipe(result.day_and_night());
              }, 
               sync_example:function(){
                  return new Pipeline("sync_example")
                      .addPipe(result.day_and_night());
              }, 
               listener_slower:function(){
                   return  new Pipeline("pipelineListen")
                        .addTransformation( fns.the_slower_fn);

               }
           };
           return result;
       });
