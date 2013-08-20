define([  "js/common.js", 
          "js/pipelines/dispatcher.js", 
          "js/open_stack/d3_ui.js","js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js","js/pipelines/mapper_pipeline_type.js","js/pipelines/state_step_type.js"],
       function(common, dispatcher, d3_ui, Foreach_Pipeline,Pipeline, Mapper_Pipeline, StateStep) {

           var d3_show_images_and_flavors_pipeline=function(){
               return new Pipeline("d3_show_resources_from_tenant")
                   .addTransformation(d3_show_tenants())
                   .addTransformation(new StateStep("d3_show_images", function(data_state, callback){
                       if(data_state["LIST IMAGES"]){
                       var images_node=common.create_node("images", common.create_data("folder", {name:"images"}));
                       
                       data_state["LIST IMAGES"].images.map(function(item){
                           var href=item.links[0].href;
                                                          //TODO  related to openstack local conf
                               if(data_state.host.indexOf(common.local_ip)!=-1)
                               href=href.replace(common.local_ip,data_state.host );
                               // end change

                           images_node.children.push(
                               common.create_node(item.name, common.create_data("image", {"href":href}
                                                                 )));
                       });
                       function get_tenant(collection, key, searching){
                           
                           for(var i=0; i<collection.length; i++){
                               var interior=collection[i];
                               if(interior[key]==searching)
                                   return interior;
                           }

                           throw "tentant dont find";
                       };
                       get_tenant(data_state.d3_open_stack.children[0].children, "name", data_state.tenant_name).children.push(images_node);               

                       function on_success_callback(){
                          // callback(null, data_state);
                       }

                       d3_ui($.extend(true, {}, data_state.d3_open_stack),
                                  data_state,this, dispatcher, on_success_callback);
                       //TODO remove if we need selection
                       }
                       callback(null, data_state);
                       
                   }))
                   .addTransformation(new StateStep("d3_show_networks", function(data_state, callback){
                       if(data_state["LIST NETWORKS"]){
                       var networks_node=common.create_node("networks", common.create_data("folder", {name:"networks"}));
                       
                       data_state["LIST NETWORKS"].networks.map(function(item){
                           var href=item.id;

                           networks_node.children.push(
                               common.create_node(item.name, common.create_data("network", 
                                                                  {href:href})));
                       });
                       function get_tenant(collection, key, searching){
                           
                           for(var i=0; i<collection.length; i++){
                               var interior=collection[i];
                               if(interior[key]==searching)
                                   return interior;
                           }

                           throw "tentant dont find";
                       };
                       get_tenant(data_state.d3_open_stack.children[0].children, "name", data_state.tenant_name).children.push(networks_node);               

                       function on_success_callback(){
                     //      callback(null, data_state);
                       }

                       d3_ui($.extend(true, {}, data_state.d3_open_stack),
                                  data_state,this, dispatcher, on_success_callback);
                       //TODO remove if we need selection
                         }
                       callback(null, data_state);
                       
                   }))
                   .addTransformation(new StateStep("d3_show_flavors", function(data_state, callback){
                          if(data_state["LIST FLAVORS"]){
                       var flavors_node=common.create_node("flavors", common.create_data("folder", {name:"flavors"}));
                       
                       data_state["LIST FLAVORS"].flavors.map(function(item){
                           var href=item.links[0].href;
                           //TODO  related to openstack local conf
                               if(data_state.host.indexOf(common.local_ip)!=-1)
                               href=href.replace(common.local_ip,data_state.host );
                               // end change
                           flavors_node.children.push(
                               common.create_node(item.name, common.create_data("flavor", 
                                                                  {href:href})));
                       });
                       function get_tenant(collection, key, searching){
                           
                           for(var i=0; i<collection.length; i++){
                               var interior=collection[i];
                               if(interior[key]==searching)
                                   return interior;
                           }

                           throw "tentant dont find";
                       };
                       get_tenant(data_state.d3_open_stack.children[0].children, "name", data_state.tenant_name).children.push(flavors_node);               

                       function on_success_callback(){
                     //      callback(null, data_state);
                       }

                       d3_ui($.extend(true, {}, data_state.d3_open_stack),
                                  data_state,this, dispatcher, on_success_callback);
                       //TODO remove if we need selection
                         }
                       callback(null, data_state);
                       
                   }));
               };

           var d3_show_tenants=function(){
              return  new Pipeline("d3_show_tenants")
                   .addTransformation(new StateStep("d3_show_tenants",function(data_state, callback){
                       console.log("d3_show_tenants");
                       data_state.d3_open_stack=common.create_node("open stack",common.create_data("root", {}) );
                       var tenants=common.create_node("tenants", common.create_data("folder", {name:"tenants"}));
                       data_state.tenants_select.map(function(item){
                           tenants.children.push(common.create_node(item.visible, common.create_data("tenant", item)));
                       } );
                       

                       //  alert("here i am: "+toJson(data_state.d3_open_stack));
                       data_state.d3_open_stack.children.push(tenants);
                       
                       function on_success_callback(){
                  //         callback(null, data_state);
                       }

                       d3_ui($.extend(true, {}, data_state.d3_open_stack),
                                  data_state, this, dispatcher, on_success_callback);
                       // this line uncommented means that the user is using the select dropmenu to select the tenant, otherwise we have to useon_success_callback and wait to be called from d3 interface
                       callback(null, data_state);
                       
                   }));
               };


          

           return {d3_show_tenants:d3_show_tenants, d3_show_images_and_flavors:d3_show_images_and_flavors_pipeline};

       });
