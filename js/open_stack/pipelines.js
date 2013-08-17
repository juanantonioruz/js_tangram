define([   "js/common.js","js/open_stack/dao.js",  "js/open_stack/selects.js","js/open_stack/query.js","js/open_stack/model.js", "js/open_stack/operations.js",  "js/open_stack/html_helper.js", "js/d3/cluster.js","js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js","js/pipelines/mapper_pipeline_type.js", "js/pipelines/switcher_pipeline_type.js","js/pipelines/state_step_type.js","js/pipelines/dispatcher.js","js/open_stack/events.js"],
       function(common, dao, selects, query, model,operations, html_helper,  d3_cluster, Foreach_Pipeline,Pipeline, Mapper_Pipeline,Switcher_Pipeline, StateStep, dispatcher,events) {


           function get_load_operation(pipe_ns, operation_fn){
               return new Pipeline(pipe_ns+ "_load_operation")
                   .addTransformation(operations.show_operation_value_selected)
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
                       .addTransformation( html_helper.register_form  );
               },
               show_tenants:function(){
                   return new Pipeline(this.name)
                   .addTransformation(result.load_tokens)
                    .addTransformation(result.load_tenants)
                    .addTransformation(selects.select_tenants)
                   ;
               },
               show_tenant_actions:function(){
                   return new Pipeline(this.name)
                       .addTransformation(result.load_endpoints)
                       .addTransformation(selects.select_actions);
               },
               run_action:function(){
                   
                   return new Mapper_Pipeline(this.name, 
                                              {
                                                  "listing_images": function(){return get_load_operation("list_images", operations.list_images);},
                                                  "listing_flavors": function(){return get_load_operation("list_flavors", operations.list_flavors);},
                                                  "listing_networks": function(){return get_load_operation("list_networks", operations.list_networks);},
                                                  "listing_subnets": function(){return get_load_operation("list_subnets", operations.list_subnets);},
                                                  "listing_servers": function(){return get_load_operation("list_servers", operations.list_servers);},
                                                  "create_server":result.create_server_options,
                                                  "create_network":result.create_network_options,
                                                  "create_subnet":result.create_subnet_options
                                                  
                                              }, 
                                              "action_selected");
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

               //hide this layer
               load_tokens:function(){
                   return new Pipeline(this.name)
                       
                       .addTransformation(query.query_tokens)
                        .addTransformation(dao.dao)
                        .addTransformation(model.model_store_token_id)
                   ;
               },
               load_tenants:function(){
                   return new Pipeline(this.name)
                   .addTransformation(query.query_tenants)
                   .addTransformation(dao.dao)
                   .addTransformation(model.model_store_tenants)

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
               load_images_flavors_networks:function(){
                   return new Pipeline(this.name)
                       .addTransformation(get_load_operation("list_images", operations.list_images))
                       .addTransformation(get_load_operation("list_flavors", operations.list_flavors))
                       .addTransformation(get_load_operation("list_networks", operations.list_networks))
                   ;
               },
               create_network_options:function(){
                   return new Pipeline(this.name)
                       .addTransformation(new StateStep("insert_network_name", function(data_state, callback){

                           var me=this;
                           $('.user_input').remove();
                           $('#suboperations').append("<div id='user_form' class='user_input'><input type='text' id='network_name' value='test'></div>");

                           
                           $('#network_name').keypress( function(e){
                               if(e.which==13){
                                   data_state.network_name=$('#network_name').val();
                                   if(data_state.network_name.length>2){
                                       dispatcher.dispatch("send_create_network", me.pipeline, data_state);

                                   }else
                                   alert("too short name, try again please");
                               }else{

                                   
                               }
                           });
                           callback(null, data_state);
                       })); 
               },
               create_subnet_options:function(){
                   return new Pipeline(this.name)
                       .addTransformation(new Pipeline("load_networks")
                                          .addTransformation(get_load_operation("list_networks", operations.list_networks))
                                          

                                         )
                       .addTransformation(new StateStep("insert_subnet_name", function(data_state, callback){

                           var me=this;
                           $('.user_input').remove();
                           $('#suboperations').append("<div id='user_form' class='user_input'>"+
                                                      " <br>CIDR<input type='text' id='cidr' value='10.0.3.0/24'>"+
                                                      "<br>allocation_pools start<input type='text' id='start' value='10.0.3.20'>"+
                                                      " <br>allocation_pools end<input type='text' id='end' value='10.0.3.150'>"+
                                                      "<input type='button' class='send_form' value='send'>"+
                                                      "</div>");

                           
                           $('.send_form').on('click', function(){

                                   data_state.subnet_cidr=$('#cidr').val();
                                   data_state.subnet_start=$('#start').val();
                                   data_state.subnet_end=$('#end').val();
                                   if(data_state.subnet_cidr.length>8 && data_state.network_selected){
                                       dispatcher.dispatch("send_create_subnet", me.pipeline, data_state);

                                   }else
                                   alert("too short cidr or select the network circle!, try again please");

                           });
                           callback(null, data_state);
                       })); 
               },
               create_server_options:function(){
                   return new Pipeline(this.name)
                       .addTransformation(result.load_images_flavors_networks)
                       .addTransformation(new StateStep("insert_server_name", function(data_state, callback){
                           //                    $('#tenants').fadeOut();
                           var me=this;
                           $('.user_input').remove();
                           $('#suboperations').append("<div id='user_form' class='user_input'><input type='text' id='server_name' value='test'></div>");

                           
                           $('#server_name').keypress( function(e){
                               if(e.which==13){
                                   data_state.server_name=$('#server_name').val();
                                   if(data_state.flavor_selected && data_state.image_selected && data_state.network_selected){
                                       dispatcher.dispatch("send_create_server", me.pipeline, data_state);
                                   }else
                                   alert("select first and image and flavor to create this server");
                               }else{

                                   
                               }
                           });
                           callback(null, data_state);
                       })); 
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







