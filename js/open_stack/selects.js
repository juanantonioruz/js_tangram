define(["js/common.js", "js/pipelines/dispatcher.js"],
       function(common, dispatcher) {
           function show_dom_select(select_dom_id, the_dom_place_to_append_the_select, the_collection, the_on_change_select_fn, store_model_in_option){

               return function(){
                   $(select_dom_id).remove();
                   $(the_dom_place_to_append_the_select).append("<select id='"+select_dom_id.replace('#', '')+"'></select>");
                   $.each(the_collection, function(i, value){
                       var option=$("<option value='"+value.hidden+"'>"+value.visible+"</option>");
                       if(store_model_in_option)
                           option.data("item", value.item);
                       $(select_dom_id).append(option);
                   });
                   $(select_dom_id).prop("selectedIndex", -1);
                   $(select_dom_id).change(the_on_change_select_fn(select_dom_id));
               };
           }

           function show_fn_result_to_the_user_and_wait(the_message, the_function){

               $('#loading').fadeOut(1000, function(){
                   $('#loading')
                       .html(the_message)
                       .css('background-color', 'yellow')
                       .fadeIn(1000, the_function());
               }
                                    );
           }


           var result= {
               
               actions:function(data_state, callback){
                   var target_pipeline=this.pipeline;
                   show_fn_result_to_the_user_and_wait("please select an action: ", 
                                                       function(){
                                                           $('#register_form').append("<div id='actions_available'><h2> actions available</h2></div><div id='suboperations'></div>").fadeIn(100, function(){
                                                               
                                                               show_dom_select(
                                                                   "#init_filter", 
                                                                   "#actions_available",
                                                                   [
                                                                       {visible:"listing_images", hidden:"listing_images"},
                                                                       {visible:"listing_flavors", hidden:"listing_flavors"},
                                                                       {visible:"listing_networks", hidden:"listing_networks"},
                                                                       {visible:"listing_subnets", hidden:"listing_subnets"},
                                                                       {visible:"listing_servers", hidden:"listing_servers"},
                                                                       {visible:"create server", hidden:"create_server"},
                                                                       {visible:"create network", hidden:"create_network"},
                                                                       {visible:"create subnet", hidden:"create_subnet"}
                                                                   ], 
                                                                               
                                                                   function(select_dom_id){ 
                                                                       return function(){
                                                                           var selected=$(select_dom_id+" option:selected").first().val();
                                                                           data_state.action_selected=selected;
                                                                           show_message_to_the_user("action selected: "+selected);
                                                                           $('#suboperations').fadeOut().html("").fadeIn();
                                                                           dispatcher.dispatch("action_selected", target_pipeline,data_state,  function(res,pipeline){console.log("action_selected!");} );
                                                                       };
                                                                   })();
                                                               
                                                               callback(null, data_state);
                                                           });

                                                       });
               },


               tenants:function (data_state, callback){
                   var state_step=this;
                   function show_tenant_select(){


                       //                                          var select_dom_id=;
                       var the_dom_place_to_append_the_select='#register_form';
                       var the_on_change_select_fn=function(select_dom_id){
                           return function(){
                               $("#suboptions").remove();

                               var selected=$(select_dom_id+" option:selected").first();
                               data_state.tenant_name=selected.val();
                               data_state.tenant_id=selected.data('item').id;


                               // clean interface is a function declared in start_proposal
                               clean_interface();
                               //                                               show_tenant_endpoints_pipeline_fn();
                               show_message_to_the_user("you have selected tenant: "+data_state.tenant_name);
                               dispatcher.dispatch("tenant_selected", state_step, data_state,  function(res,pipeline){console.log("tenant_selected!");} );
                           };
                       };
                       //TODO: fn in start proposal, with global scope
                       show_dom_select("#tenants", the_dom_place_to_append_the_select,data_state.tenants_select,  the_on_change_select_fn, true)();
                       callback(null, data_state);
                   }
                   //TODO fn in start proposal, with global scope
                   show_fn_result_to_the_user_and_wait('Please select a tenant to view its services available', 
                                                       show_tenant_select);


               }


               
           };
           return common.naming_fns(result, "select_");

       });
