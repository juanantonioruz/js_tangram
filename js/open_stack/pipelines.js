define([   "js/common.js","js/open_stack/dao.js",  "js/open_stack/selects.js", "js/open_stack/loadings.js",  "js/open_stack/html_helper.js", "js/d3/cluster.js","js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js","js/pipelines/mapper_pipeline_type.js", "js/pipelines/state_step_type.js"],
       function(common, dao, selects, loadings,html_helper,  d3_cluster, Foreach_Pipeline,Pipeline, Mapper_Pipeline, StateStep) {

           function get_select_tenant_for_current_user(pipe_ns){
               return new Pipeline(pipe_ns)
                   .addTransformation( 
                       loadings.tenants)
                   .addTransformation( 
                       selects.tenants);
           }


           var result={
               register:function(){
                   return new Pipeline(this.name)
                       .addTransformation( html_helper.register_form  );
               },
               load_tokens_and_select_actions:function(){
                   return new Pipeline(this.name)
                       .addTransformation(loadings.prepare_tokens)
                       .addTransformation(dao.dao)
                       .addTransformation(loadings.loaded_tokens)
                       .addTransformation( selects.actions );
               },
               action_choosen:function(){
                   return new Mapper_Pipeline(this.name, 
                                              {"listing_resources": function(){return html_helper.list_resources;},// result.select_tenant_to_list_resources, 
                                               "create_server":result.select_tenant_to_create_server}, "action_selected");
               },
               select_tenant_to_list_resources:function(){
                   return get_select_tenant_for_current_user(this.name);
               },
               select_tenant_to_create_server:function(){
                   return get_select_tenant_for_current_user(this.name);
               },
               select_service_pipeline_for_current_tenant:function(){
                   return new Pipeline(this.name)
                       .addTransformation( 
                           loadings.endpoints)
                       .addTransformation( 
                           selects.endpoints      
                       );
               },
               operation_choosen:function(){
                   
                   return new Mapper_Pipeline(this.name, 
                                              {
                                                  "glance":
                                                  function(){
                                                      return new Pipeline("glance_operations")
                                                          .addTransformation( loadings.glance_operations)
                                                          .addTransformation( selects.available_service_operations);
                                                  }, 


                                                  "nova":function(){
                                                      return new Pipeline("nova_operations")
                                                          .addTransformation( loadings.nova_operations)
                                                          .addTransformation( selects.available_service_operations);
                                                  },
                                                  "cinder":function(){
                                                      return new Pipeline("cinder_operations")
                                                          .addTransformation( loadings.cinder_operations)
                                                          .addTransformation( selects.available_service_operations);
                                                  }


                                              }, 
                                              "option_service_selected_name");
               },
               load_operation:function(){ 
                   return new Pipeline(this.name)
                       .addTransformation(loadings.prepare_operation)
                       .addTransformation(dao.dao)
                       .addTransformation(loadings.show_operation_result)               
                   ;
               },
               create_server_for_selected_tenant:function(){


                   function get_load_pipe(name, data_operation){
                       return new Pipeline(name)
                           .addTransformation(new StateStep("create_server_"+name, function(data_state, callback){
                               data_state.data_operation={title:data_operation.title, url:data_operation.url, host:data_state[data_operation.host]};
                               loadings.prepare_operation.transform_fn(data_state, callback);
                           }))
                           .addTransformation(dao.dao)
                           .addTransformation(loadings.show_operation_result);
                   }


                   return new Pipeline(this.name)
                       .addTransformation( loadings.endpoints)
                       .addTransformation(new StateStep("create_server_select_nova_endpoint", function(data_state, callback){
                           var concordances=data_state.serviceCatalog.filter(function (element, index, array) {
                               return (element.type == "compute");
                           });
                           data_state.nova_endpoint_url=concordances[0].endpoints[0].publicURL;
                           
                           callback(null, data_state);
                       }))
                       .addPipe(get_load_pipe("load_nova_images",{title:"nova_images", url:"/images", host:"nova_endpoint_url"}))
                       .addPipe(get_load_pipe("load_nova_flavors",{title:"nova_flavors", url:"/flavors", host:"nova_endpoint_url"}))
                       .addTransformation(new StateStep("create_server_wait_for_the_name", function(data_state, callback){
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
                       }))
                       .addTransformation( loadings.create_server)
                       .set_on_success(function(results, pipeline){
                           alert("server_name: "+results.server_name+"\n------>endpoint: "+results.nova_endpoint_url+"\n---> first_image: "+results.nova_images.images[0].links[0].href+"\n--->first_flavor: "+
                                 results.nova_flavors.flavors[0].links[0].href);
                           
                       });
               }

           };
           
           


           
           return common.naming_pipes(result);
       });







