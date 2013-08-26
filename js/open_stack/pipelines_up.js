define([  "js/defines.js", "js/open_stack/pipelines.js", "js/open_stack/ui.js","js/pipelines/pipeline_type.js"],
       function(defines, pipelines, ui, Pipeline) {



           var result={
               //Public API


               ok_register:defines.pipe({arr:
                                             [
                                                 {item_name_fn:ui.ui_empty_register_form},
                                                 {item_name_fn:defines.pipe(pipelines.pipes.load_tenants.spec)},
                                                 {item_name_fn:ui.ui_select_tenants}
                                                
                                             ], 
                                             spec:{type:Pipeline, params:[]}})







           };
           
           


           
           return result;
       });







