define([   "js/common.js","js/open_stack/dao.js",  "js/open_stack/query.js","js/open_stack/model.js",   "js/open_stack/ui.js","js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js","js/pipelines/mapper_pipeline_type.js", "js/pipelines/switcher_pipeline_type.js","js/pipelines/state_step_type.js","js/pipelines/dispatcher.js","js/open_stack/events.js","js/open_stack/model/operation.js"],
       function(common, dao, query, model,ui,  Foreach_Pipeline,Pipeline, Mapper_Pipeline,Switcher_Pipeline, StateStep, dispatcher,events, operation_model) {

           function select_load_operation(key, key2){
               return new Pipeline("selecting_"+key+"_"+key2)
                   .addTransformation(new StateStep("manual_selection", 
                                                    function(data_state, callback){
                                                        operation_model.manual_selecting_operation(data_state, key, key2);
                                                        callback(null, data_state);
                                                    }))
                   .addTransformation(result.load_operation)
               ;
           };
           function add_load(pipe, fn){
           }

           var contador=0;

           var result={
               //Public API

               load_tokens:[{process:query.query_tokens},{process:dao.dao}, {process:model.model_store_token_id}],


               load_tenants:function(){
                   return new Pipeline(this.name)
                       .addTransformation(query.query_tenants)
                       .addTransformation(dao.dao)
                       .addTransformation(model.model_store_tenants)
                   ;
               },

               load_tenant_selected:function(){
                   return new Pipeline(this.name)

                       .addTransformation( query.query_endpoints)
                       .addTransformation( dao.dao)
                       .addTransformation( model.model_store_endpoints);


               },



               load_operation:function (){
                   return new Pipeline(this.name)
                       .addTransformation(query.query_operation)
                       .addTransformation(dao.dao)
                       .addTransformation(model.model_store_operation);
                   //TODO in each implementation
                   // defined outside in a layer of more specification

               },

               operation_selected:function(){
                   return new Pipeline(this.name)
                       .addTransformation(new Switcher_Pipeline("",
                                                                function(value){
                                                                    if(value.indexOf("listing")!=-1){
                                                                        return new Pipeline("listing")
                                                                            .addTransformation(result.load_operation)
                                                                            .addTransformation(new Mapper_Pipeline(this.name, 
                                                                                                                   {
                                                                                                                       "listing_images": new Pipeline("")
                                                                                                                           .addTransformation(result.provisional_alert_display),

                                                                                                                       "listing_flavors": new Pipeline("")
                                                                                                                           .addTransformation(result.provisional_alert_display),

                                                                                                                       "listing_networks": new Pipeline("")
                                                                                                                           .addTransformation(result.provisional_alert_display),

                                                                                                                       "listing_subnets": new Pipeline("")
                                                                                                                           .addTransformation(result.provisional_alert_display),

                                                                                                                       "listing_servers": new Pipeline("")
                                                                                                                           .addTransformation(result.provisional_alert_display)
                                                                                                                   }, 
                                                                                                                   "operation_selected.hidden"));
                                                                    }else{
                                                                        return new Pipeline("creating")
                                                                            .addTransformation(new Mapper_Pipeline("creating", 
                                                                                                                   {
                                                                                                                       "create_server":new Pipeline(this.name) 
                                                                                                                           .addTransformation(select_load_operation("list","images" ))
                                                                                                                           .addTransformation(select_load_operation("list","flavors"))
                                                                                                                           .addTransformation(select_load_operation("list","networks"))
                                                                                                                           .addTransformation(ui.ui_create_server_options)
                                                                                                                       ,
                                                                                                                       
                                                                                                                       "create_network": new Pipeline(this.name)
                                                                                                                           .addTransformation(ui.ui_create_network_options) 
                                                                                                                       ,
                                                                                                                       "create_subnet":new Pipeline(this.name)
                                                                                                                           .addTransformation(select_load_operation("list","networks"))
                                                                                                                           .addTransformation(ui.ui_create_subnet_options)

                                                                                                                   }, 
                                                                                                                   "operation_selected.hidden"));

                                                                    }
                                                                },
                                                                "operation_selected.hidden"
                                                               ))
                   ;
               },               
               send_create_server:function(){
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

               





               //helpers try to get out of this file
               alerta:function(){

                   return new Pipeline(this.name)
                       .addTransformation(new StateStep("alerta_s", function(data_state, callback){
                           console.log("\n***************** ALERTA "+contador+"+ CONSOLE\n\n here"+data_state.token_id+"\n\n\n");

                           console.dir(data_state);
                           $('#content').prepend( "<h2>show prov result: "+this.key+"</h2>" );                                 
                           $('#content').prepend( "<h2>show prov result: </h2><pre><code class='json'>"+ !this.key ? "null" : common.toJson(data_state[this.key])+"</code></pre>" );                                 
                           contador++;
                           callback(null, data_state);
                       }));


               },
               provisional_alert_display:function(){
                   return new Pipeline(this.name)
                       .addTransformation(new StateStep("now", function(data_state, callback){
                           $('#content').prepend( "<h2>show prov result: </h2><pre><code class='json'>"+common.toJson(data_state[data_state.operation_selected.hidden])+"</code></pre>" );                                 


                           callback(null, data_state);
                       }));

               }
           };
           
           


           
           return {pipes:common.naming_pipes(result), load_operation:select_load_operation};
       });







