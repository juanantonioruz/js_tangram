define([ "js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js"],
       function( Foreach_Pipeline,Pipeline) {

           


           return new Pipeline("show_tenant_endpoints_pipeline ")
           

               .set_on_error(
                   function(error, pipeline){
                       alert("error"+toJson(error));})

           //        .apply_transformations(State())
           ;



       });
