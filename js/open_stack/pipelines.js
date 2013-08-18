define([   "js/common.js","js/open_stack/dao.js",  "js/open_stack/query.js","js/open_stack/model.js", "js/open_stack/operations.js",  "js/open_stack/html_helper.js", "js/d3/cluster.js","js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js","js/pipelines/mapper_pipeline_type.js", "js/pipelines/switcher_pipeline_type.js","js/pipelines/state_step_type.js","js/pipelines/dispatcher.js","js/open_stack/events.js"],
       function(common, dao, query, model,operations, ui,  d3_cluster, Foreach_Pipeline,Pipeline, Mapper_Pipeline,Switcher_Pipeline, StateStep, dispatcher,events) {


           function get_load_operation(pipe_ns, operation_fn){
               return new Pipeline(pipe_ns+ "_load_operation")
                   .addTransformation(ui.ui_show_operation_value_selected)
                   .addTransformation(operation_fn)
                   .addTransformation(query.query_operation)
                   .addTransformation(dao.dao)
                   .addTransformation(model.model_store_operation)
                   .addTransformation(dao.show_result);
           }
           function add_load(pipe, fn){
           }
           var result={
               //Public API
               register:function(){
                   return new Pipeline(this.name)
                       .addTransformation( ui.ui_register_form  );
               },

               load_tokens:function(){
                   return new Pipeline(this.name)

                       .addTransformation(query.query_tokens)
                       .addTransformation(dao.dao)
                       .addTransformation(model.model_store_token_id);
               },


               show_tenants:function(){
                   return new Pipeline(this.name)
               
                       .addTransformation(query.query_tenants)
                       .addTransformation(dao.dao)
                       .addTransformation(model.model_store_tenants)
                       .addTransformation(ui.ui_select_tenants)
                   ;
               },
               show_tenant_operations:function(){
                   return new Pipeline(this.name)
                       .addTransformation(result.load_endpoints)
                       .addTransformation(ui.ui_select_operations);
               },
               run_operation:function(){
                   return new Mapper_Pipeline(this.name, 
                                              {
                                                  "listing_images": function(){return get_load_operation("list_images", operations.list_images);},
                                                  "listing_flavors": function(){return get_load_operation("list_flavors", operations.list_flavors);},
                                                  "listing_networks": function(){return get_load_operation("list_networks", operations.list_networks);},
                                                  "listing_subnets": function(){return get_load_operation("list_subnets", operations.list_subnets);},
                                                  "listing_servers": function(){return get_load_operation("list_servers", operations.list_servers);},
                                                  
                                                  "create_server":new Pipeline(this.name) 
                                                      .addTransformation(get_load_operation("list_images", operations.list_images))
                                                      .addTransformation(get_load_operation("list_flavors", operations.list_flavors))
                                                      .addTransformation(get_load_operation("list_networks", operations.list_networks))
                                                      .addTransformation(ui.ui_create_server_options)
                                                  ,
                                                  
                                                  "create_network": new Pipeline(this.name)
                                                      .addTransformation(ui.ui_create_network_options) 
                                                  ,
                                                  "create_subnet":new Pipeline(this.name)
                                                      .addTransformation(get_load_operation("list_networks", operations.list_networks))
                                                      .addTransformation(ui.ui_create_subnet_options)
                                                  
                                              }, 
                                              "operation_selected");
               },               
               create_server:function(){
                   return new Pipeline(this.name)
                       .addTransformation( query.query_create_server)
                       .addTransformation(dao.dao)
                       .addTransformation(dao.show_result)
                   ;

               },
               create_network:function(){
                   return new Pipeline(this.name)
                       .addTransformation( query.query_create_network)
                       .addTransformation(dao.dao)
                       .addTransformation(dao.show_result)
                   ;

               },
               create_subnet:function(){
                   return new Pipeline(this.name)
                       .addTransformation( query.query_create_subnet)
                       .addTransformation(dao.dao)
                       .addTransformation(dao.show_result)
                   ;

               },

               

               load_endpoints:function(){
                   return new Pipeline(this.name)
                       .addTransformation( query.query_endpoints)
                       .addTransformation( dao.dao)
                       .addTransformation( model.model_store_endpoints);
               },
               load_operation_selected:function(){ 
                   return new Pipeline(this.name)
                       .addTransformation(query.query_operation)
                       .addTransformation(dao.dao)
                       .addTransformation( model.model_store_operation)
                       .addTransformation(dao.show_result)               
                   ;
               },



               //helpers try to get out of this file
               alerta:function(){

                   return new Pipeline(this.name)
                       .addTransformation(new StateStep("alerta", function(data_state, callback){
                           alert("here"+data_state.token_id);
                           callback(null, data_state);
                       }));


               }

           };
           
           


           
           return common.naming_pipes(result);
       });







