define([   "js/common.js","js/open_stack/dao.js",  "js/open_stack/selects.js", "js/open_stack/loadings.js", "js/open_stack/operations.js",  "js/open_stack/html_helper.js", "js/d3/cluster.js","js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js","js/pipelines/mapper_pipeline_type.js", "js/pipelines/state_step_type.js","js/pipelines/dispatcher.js"],
       function(common, dao, selects, loadings,operations, html_helper,  d3_cluster, Foreach_Pipeline,Pipeline, Mapper_Pipeline, StateStep, dispatcher) {

           function get_select_tenant_for_current_user(pipe_ns){
               return new Pipeline(pipe_ns)
                   .addTransformation(loadings.prepare_tenants)
                   .addTransformation(dao.dao)
                   .addTransformation(loadings.store_tenants)
                   .addTransformation(selects.tenants);
           }
           function get_load_operation(pipe_ns, operation_fn){
               return new Pipeline(pipe_ns+ "_load_operation")
                   .addTransformation(operations.show_operation_value_selected)
                   .addTransformation(operation_fn)
                   .addTransformation(loadings.prepare_operation)
                   .addTransformation(dao.dao)
                   .addTransformation(loadings.show_operation_result);
           }
           function add_load(pipe, fn){
           }
           var result={
               //Public
               register:function(){
                   return new Pipeline(this.name)
                       .addTransformation( html_helper.register_form  );
               },
               load_tokens_and_load_tenants:function(){
                   return new Pipeline(this.name)
                       .addTransformation(loadings.prepare_tokens)
                       .addTransformation(dao.dao)
                       .addTransformation(loadings.store_token_id)
                       .addTransformation( get_select_tenant_for_current_user("load_and_show_select_tenants"));
               },
               show_select_actions:function(){
                   return new Pipeline(this.name)
                       .addTransformation(result.load_endpoints_for_current_tenant)
                       .addTransformation(selects.actions);

                   
               },
               run_action_selected:function(){
                   
                   return new Mapper_Pipeline(this.name, 
                                              {
                                                  "listing_images": function(){return get_load_operation("list_images", operations.list_images);},
                                                  "listing_flavors": function(){return get_load_operation("list_flavors", operations.list_flavors);},
                                                  "listing_networks": function(){return get_load_operation("list_networks", operations.list_networks);},
                                                  "listing_subnets": function(){return get_load_operation("list_subnets", operations.list_subnets);},
                                                  "listing_servers": function(){return get_load_operation("list_servers", operations.list_servers);},
                                                  "create_server":function(){
                                                      return new Pipeline("creating_server")
                                                          .addTransformation(result.load_images_flavors_networks_from_tenant)
                                                          .addTransformation(new StateStep("insert_server_name", function(data_state, callback){
                                                              //                    $('#tenants').fadeOut();
                                                              var me=this;
                                                              $('#suboperations').append("<div id='server_name_form'><input type='text' id='server_name' value='test_server'></div>");

                                                              
                                                              $('#server_name').keypress( function(e){
                                                                  if(e.which==13){
                                                                      data_state.server_name=$('#server_name').val();
                                                                      if(data_state.flavor_selected && data_state.image_selected && data_state.network_selected){
//                                                                          dispatcher.dispatch("send_create_server", me, data_state);
                                                                          dispatcher.dispatch("send_create_server", me.pipeline, data_state);

                                                                      }else
                                                                          alert("select first and image and flavor to create this server");
                                                                  }else{

                                                                      
                                                                  }
                                                              });
                                                              callback(null, data_state);
                                                          }));

                                                      
                                                  }
                                                  
                                              }, 
                                              "action_selected");
               },               
               create_server:function(){
                   return new Pipeline(this.name)
                       .addTransformation( loadings.create_server)
                       .set_on_success(function(results, pipeline){
                           alert("created server_name: "+results.server_name);

                           
                       });

               },

               //hide this layer
               load_endpoints_for_current_tenant:function(){
                   return new Pipeline(this.name)
                       .addTransformation( loadings.prepare_endpoints)
                       .addTransformation( dao.dao)
                       .addTransformation( loadings.store_endpoints);
                   //                       .addTransformation(  selects.endpoints);
               },
               load_operation_selected:function(){ 
                   return new Pipeline(this.name)
                       .addTransformation(loadings.prepare_operation)
                       .addTransformation(dao.dao)
                       .addTransformation(loadings.show_operation_result)               
                   ;
               },
               load_images_flavors_networks_from_tenant:function(){
                   return new Pipeline(this.name)
                       .addTransformation(get_load_operation("list_images", operations.list_images))
                       .addTransformation(get_load_operation("list_flavors", operations.list_flavors))
                       .addTransformation(get_load_operation("list_networks", operations.list_networks))
                       .addTransformation(new StateStep("end_resouces_loaded", function(data_state, callback){
                           dispatcher.dispatch("server_resources_loaded", this, data_state);
                           callback(null, data_state);
                       }))

                   ;
               },
               

               //helpers with a bit of  nosense
               alerta:function(){

                   return new Pipeline(this.name)
                       .addTransformation(new StateStep("alerta", function(data_state, callback){
                           alert("here");
                           callback(null, data_state);
                       }));


               }





           };
           
           


           
           return common.naming_pipes(result);
       });







