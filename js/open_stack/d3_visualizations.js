define([  "js/open_stack/loadings.js", "js/pipelines/dispatcher.js", "js/d3/cluster.js","js/pipelines/foreach_pipeline_type.js", "js/pipelines/pipeline_type.js","js/pipelines/mapper_pipeline_type.js"],
       function(loadings, dispatcher, d3_cluster, Foreach_Pipeline,Pipeline, Mapper_Pipeline) {
           var d3_show_images_and_flavors_pipeline=function(){
               return new Pipeline("d3_show_images_and_flavors")
                   .addTransformation("d3_show_images", function(data_state, callback){
                       var images_node=create_node("images", create_data("folder", {name:"images"}));
                       
                       data_state.nova_images.images.map(function(item){
                           images_node.children.push(
                               create_node(item.name, create_data("image", {"href":item.links[0].href}
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
                           callback(null, data_state);
                       }

                       d3_cluster($.extend(true, {}, data_state.d3_open_stack),
                                  data_state, on_success_callback);
                       //TODO remove if we need selection
                       callback(null, data_state);
                       
                   })
                   .addTransformation("d3_show_flavors", function(data_state, callback){
                       var flavors_node=create_node("flavors", create_data("folder", {name:"flavors"}));
                       
                       data_state.nova_flavors.flavors.map(function(item){
                           flavors_node.children.push(
                               create_node(item.name, create_data("flavor", 
                                                                  {href:item.links[0].href})));
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

                       d3_cluster($.extend(true, {}, data_state.d3_open_stack),
                                  data_state, on_success_callback);
                       //TODO remove if we need selection
                       callback(null, data_state);
                       
                   });
               };

           var d3_show_tenants=function(){
              return  new Pipeline("d3_show_tenants")
                   .addTransformation("d3_show_tenants", function(data_state, callback){
                       console.log("d3_show_tenants");
                       data_state.d3_open_stack=create_node("open stack",create_data("root", {}) );
                       var tenants=create_node("tenants", create_data("folder", {name:"tenants"}));
                       data_state.tenants_select.map(function(item){
                           tenants.children.push(create_node(item.visible, create_data("tenant", {})));
                       } );
                       

                       //  alert("here i am: "+toJson(data_state.d3_open_stack));
                       data_state.d3_open_stack.children.push(tenants);
                       
                       function on_success_callback(){
                  //         callback(null, data_state);
                       }

                       d3_cluster($.extend(true, {}, data_state.d3_open_stack),
                                  data_state, on_success_callback);
                       // this line uncommented means that the user is using the select dropmenu to select the tenant, otherwise we have to useon_success_callback and wait to be called from d3 interface
                       callback(null, data_state);
                       
                   });
               };

           var show_tenant_data_pipe=function(){
               return new Pipeline("selected_d3_tenant")
           .addTransformation("loading_endpoints", loadings.endpoints);
               };

           return {d3_show_tenants:d3_show_tenants, d3_show_images_and_flavors:d3_show_images_and_flavors_pipeline, d3_show_tenant_data:show_tenant_data_pipe};

       });
