define([  "js/common.js", 
          "js/pipelines/dispatcher.js", 
          "js/open_stack/d3_ui.js","js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js","js/pipelines/mapper_pipeline_type.js","js/pipelines/state_step_type.js"],
       function(common, dispatcher, d3_ui, Foreach_Pipeline,Pipeline, Mapper_Pipeline, StateStep) {


           function init_d3_tenants(data_state){
               if(!data_state.d3_open_stack || !data_state.d3_open_stack.tenants){
                   data_state.d3_open_stack=common.create_node("open stack",common.create_data("root", {}) );
                   
                   var tenants=common.create_node("tenants", common.create_data("folder", {name:"tenants"}));
                   data_state.tenants_select.map(function(item){
                       tenants.children.push(common.create_node(item.visible, common.create_data("tenant", item)));
                   } );
                   data_state.d3_open_stack.tenants=tenants;
               }
               data_state.d3_open_stack.children=[];
               data_state.d3_open_stack.children.push(data_state.d3_open_stack.tenants);


               
           }


           var result={

           show_tenants:function(data_state, callback){


                       console.log("d3_show_tenants");
                       init_d3_tenants(data_state);
               data_state.d3_open_stack.children[0].children.map(function(item){
                   item.children=[];
               });
                       d3_ui($.extend(true, {}, data_state.d3_open_stack),  data_state, this, dispatcher);
               
                       // this line uncommented means that the user is using the select dropmenu to select the tenant, otherwise we have to useon_success_callback and wait to be called from d3 interface
                       callback(null, data_state);
                       

               },

           show_servers:show_tenant_resource("servers", "server", "LIST SERVERS", 
                                             function(item, data_state){
                                                 return common.create_node(item.name, {type:"server", href:item.links[0].href.replace(common.local_ip,data_state.host ), data:{item:{name:item.name, id:item.id}}});}),
           show_images:show_tenant_resource("images", "image", "LIST IMAGES", 
                                             function(item, data_state){
                                                 return common.create_node(item.name, {type:"image", href:item.links[0].href.replace(common.local_ip,data_state.host ), data:{item:{name:item.name, id:item.id}}});}),
           show_flavors:show_tenant_resource("flavors", "flavor", "LIST FLAVORS", 
                                             function(item, data_state){
                                                 return common.create_node(item.name, {type:"flavor", href:item.links[0].href.replace(common.local_ip,data_state.host ), data:{item:{name:item.name, id:item.id}}});}),
           show_networks:show_tenant_resource("networks", "network", "LIST NETWORKS", 
                                             function(item, data_state){
                                                 return common.create_node(item.name, {type:"network", href:item.id, data:{item:{name:item.name, id:item.id}}});})

           };
           function show_tenant_resource(resource_name, type, key_model_colection, function_item ){
               return function(data_state, callback){

                       init_d3_tenants(data_state);
                   


                       var res_d3=common.create_node(resource_name, common.create_data("folder", {name:resource_name}));

                   console.dir(res_d3);


                                          function get_tenant(collection, key, searching){
                           
                           for(var i=0; i<collection.length; i++){
                               var interior=collection[i];
                               if(interior[key]==searching)
                                   return interior;
                           }

                           throw "tentant dont find";
                       };
                      var sel_tenant= get_tenant(data_state.d3_open_stack.tenants.children, "name", data_state.tenant_name);

                   var indexOf=-1;
                   for(var i=0; i<sel_tenant.children.length;i++){
                       var ress=sel_tenant.children[i];
                       if(ress.name==res_d3.name) indexOf=i;

                   }
                   if(indexOf!=-1) sel_tenant.children.splice(indexOf, 1);

                       var servers_dao=data_state[key_model_colection][resource_name];
                       servers_dao.map(function(item){
                           res_d3.children.push(function_item(item, data_state));
                       });

                       data_state.d3_open_stack.tenants.children.map(function(item){


                           if(item.item_id==data_state.tenant_id)
                               item.children.push(res_d3);
                           else
                               item.children=[];

                       } );
                       
                       
                       function on_success_callback(){
                           //         callback(null, data_state);
                       }
                       
                       d3_ui($.extend(true, {}, data_state.d3_open_stack),  data_state, this, dispatcher, on_success_callback);
                       // this line uncommented means that the user is using the select dropmenu to select the tenant, otherwise we have to useon_success_callback and wait to be called from d3 interface
                       callback(null, data_state);
                       

               };
           };


           return common.naming_fns(result, "d3_");



       });
