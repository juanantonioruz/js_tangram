define([  "js/open_stack/dao.js",  "js/open_stack/selects.js", "js/open_stack/loadings.js",  "js/open_stack/html_helper.js", "js/pipelines/dispatcher.js", "js/d3/cluster.js","js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js","js/pipelines/mapper_pipeline_type.js"],
       function(dao, selects, loadings,html_helper, dispatcher, d3_cluster, Foreach_Pipeline,Pipeline, Mapper_Pipeline) {

           
           var pipeline_load_operation=function(){
               return new Pipeline("loading_operation")
                   .addTransformation("loading_operation", 
                                      loadings.operation);
           };

           var pipeline_show_operations=function(){
               
               return new Mapper_Pipeline("operation_choosen", 
                                                            {
                                                                "glance":
                                                                function(){
                                                                    return new Pipeline("glance_operations")
                                                                    .addTransformation("loading_glance_operations", loadings.glance_operations)
                                                                    .addTransformation("select_available_service_operations", selects.available_service_operations);
                                                                    }, 


                                                                "nova":function(){
                                                                    return new Pipeline("nova_operations")
                                                                    .addTransformation("laoding_nova_operations", loadings.nova_operations)
                                                                    .addTransformation("select_available_service_operations", selects.available_service_operations);
                                                                    }
                                                            }, 
                                   "option_service_selected_name");
               };


           var pipeline_show_services=function(){
               return new Pipeline("select_service_pipeline_for_current_tenant")
                   .addTransformation("Loading_endpoints", 
                                      loadings.endpoints)
                   .addTransformation("show_select_endpoints", 
                                      selects.endpoints      
                                     );
               };
           

           var pipeline_listing_resources=function(){
             //  alert("listing resources");
               return new Pipeline("select_tenant_pipeline_for_current_user")
                   .addTransformation("loading_tenants_please_wait", 
                                      function(data_state, callback){ 
                                          $('#chart').fadeOut().html('').fadeIn();
                                          return loadings.tenants(data_state, callback);})
                   .addTransformation("show_select_tenant", 
                                      selects.tenants);
               };

           var pipeline_server=function(){
              // alert("create server");
               return new Pipeline("create_server")
                   .addTransformation("create_server_loading_tenants", 
                                      loadings.tenants)
                   .addTransformation("create_server_show_select_tenants", 
                                      selects.tenants);
           };


           var pipeline_create_server_for_selected_tenant=function(){
               return new Pipeline("create_server_for_selected_tenant")
                   .addTransformation("create_server_loading_endpoints", loadings.endpoints)
                   .addTransformation("create_server_select_nova_endpoint",  function(data_state, callback){
                                          var concordances=data_state.serviceCatalog.filter(function (element, index, array) {
                                              return (element.type == "compute");
                                          });
                                          data_state.nova_endpoint_url=concordances[0].endpoints[0].publicURL;
                                          
                                          callback(null, data_state);
                                      })
                   .addTransformation("create_server_load_nova_images", function(data_state, callback){
                       data_state.data_operation={title:"nova_images", url:"/images", host:data_state.nova_endpoint_url};
                       
                       loadings.operation(data_state, callback);
                   })
                   .addTransformation("create_server_load_nova_flavors", function(data_state, callback){
                       data_state.data_operation={title:"nova_flavors", url:"/flavors", host:data_state.nova_endpoint_url};
                       loadings.operation(data_state, callback);
                   })
                   .addTransformation("create_server_wait_for_the_name", function(data_state, callback){
                       //                    $('#tenants').fadeOut();
                       
                       $('#suboperations').append("<div id='server_name_form'><input type='text' id='server_name' value='test_server'></div>");

                       
                       $('#server_name').keypress( function(e){
                           if(e.which==13){
                               data_state.server_name=$('#server_name').val();
                               if(data_state.flavor_selected && data_state.image_selected)
                                   callback(null, data_state);
                               else
                                   alert("select first and image and flavor to create this server");
                           }else{

                               
                           }
                       });
                   })
                   .addTransformation("create_server_call", loadings.create_server)
                   .set_on_success(function(results, pipeline){
                       alert("server_name: "+results.server_name+"\n------>endpoint: "+results.nova_endpoint_url+"\n---> first_image: "+results.nova_images.images[0].links[0].href+"\n--->first_flavor: "+
                             results.nova_flavors.flavors[0].links[0].href);
                       
                   });
               };

           



           var pipeline_load_tokens=function(){
               return new Pipeline("load_tokens_and_select_actions")
                   .addTransformation("prepare_tokens",loadings.prepare_tokens)
                   .addTransformation("dao_tokens",dao.dao)
                   .addTransformation("loaded_tokens",loadings.loaded_tokens)
                   .addTransformation("select_actions", selects.actions );
               };

           

           var pipeline_register=function(){
               return new Pipeline("register")
                   .addTransformation("show_register_form", html_helper.register_form  );
               };

           var pipeline_mapper_action_choosen= function(){
         //      alert("new action choosem");
                       return new Mapper_Pipeline("action_choosen", 
                                                                  {"listing_resources":pipeline_listing_resources, 
                                                                   "create_server":pipeline_server}, "action_selected");
                       };



           return {
               show_services:pipeline_show_services, 
               show_operations:pipeline_show_operations, 
               load_operation:pipeline_load_operation, 
               load_tokens:pipeline_load_tokens, 
               register:pipeline_register, 
               mapper_action_choosen:pipeline_mapper_action_choosen, 
               create_server_for_selected_tenant:pipeline_create_server_for_selected_tenant};
       });







