define([   "js/common.js","js/open_stack/dao.js",  "js/open_stack/query.js","js/open_stack/model.js",   "js/open_stack/ui.js","js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js","js/pipelines/mapper_pipeline_type.js", "js/pipelines/switcher_pipeline_type.js","js/pipelines/state_step_type.js","js/pipelines/dispatcher.js","js/open_stack/events.js", "js/open_stack/operations.js"],
       function(common, dao, query, model,ui,  Foreach_Pipeline,Pipeline, Mapper_Pipeline,Switcher_Pipeline, StateStep, dispatcher,events, operations) {

           function select_load_operation(){};
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
                       .addTransformation(model.model_store_token_id)
                       .addTransformation(ui.ui_empty_register_form);
                   
               },

               load_operation:function (){
                   return new Pipeline(this.name)
                       .addTransformation(query.query_operation)
                       .addTransformation(dao.dao)
                       .addTransformation(model.model_store_operation);
                   //TODO in each implementation                    .addTransformation(dao.show_result);
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

                       .addTransformation( query.query_endpoints)
                       .addTransformation( dao.dao)
                       .addTransformation( model.model_store_endpoints)

                       .addTransformation(ui.ui_select_operations);
               },
               run_operation:function(){
                   return new Mapper_Pipeline(this.name, 
                                              {
                                                  "listing_images": operations.listing_images,
                                                  "listing_flavors": result.load_operation,
                                                  "listing_networks": result.load_operation,
                                                  "listing_subnets": result.load_operation,
                                                  "listing_servers": result.load_operation,
                                                  
                                                  "create_server":new Pipeline(this.name) 
                                                      .addTransformation(select_load_operation("list_images" ))
                                                      .addTransformation(select_load_operation("list_flavors"))
                                                      .addTransformation(select_load_operation("list_networks"))
                                                      .addTransformation(ui.ui_create_server_options)
                                                  ,
                                                  
                                                  "create_network": new Pipeline(this.name)
                                                      .addTransformation(ui.ui_create_network_options) 
                                                  ,
                                                  "create_subnet":new Pipeline(this.name)
                                                      .addTransformation(select_load_operation("list_networks"))
                                                      .addTransformation(ui.ui_create_subnet_options)
                                                  
                                              }, 
                                              "operation_selected.hidden");
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







