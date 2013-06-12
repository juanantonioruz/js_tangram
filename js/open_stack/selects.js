define(["js/common.js", "js/pipelines/dispatcher.js"],
       function(common, dispatcher) {
           var result= {
             
               available_service_operations:function (data_state, callback){
               

               var target_state_step=this;
               function show_service_select(){
                   
                   var the_on_change_select_fn=function(select_dom_id){

                       return function(){
                           //                                   alert(toJson(data_state.option_service_selected.data('item')));
                           var selected=$(select_dom_id+" option:selected").first();
                           
                           data_state.operation_option=selected;
                           data_state.operation_option.data('item').host=data_state.option_service_selected.data("item").endpoints[0].publicURL;
                           data_state.operation_option.data('item').title=selected.val();
                           data_state.data_operation=data_state.operation_option.data("item");
                           data_state.option_service_selected_name=data_state.option_service_selected.data("item").name;
                           
                           // clean interface is a function declared in start_proposal
                           clean_interface();
                           //                                               show_tenant_endpoints_pipeline_fn();
                           show_message_to_the_user("you have selected operation: "+selected.val());

                           dispatcher.dispatch("operation_selected", target_state_step,data_state,  function(res,pipeline){console.info("operation_selected");} );

                       };
                   };
                   //TODO: fn in start proposal, with global scope
                   show_dom_select("#suboptions", '#suboperations',data_state.suboptions_select,  the_on_change_select_fn, true)();
                   callback(null, data_state);
               }
               //TODO fn in start proposal, with global scope
               show_fn_result_to_the_user_and_wait('Please select an option  available ', 
                                                   show_service_select);


           },

               endpoints:function (data_state, callback){
                                                  var state_step=this;                                          
                                          function show_endpoints_select(){
                                              function the_on_change_select_fn(select_dom_id){

                                                  return function (){
                                                      var option_selected=$(select_dom_id+" option:selected").first();
                                                      data_state.option_service_selected=option_selected;
                                                      data_state.option_service_selected_name=option_selected.data("item").name;
                                                      show_message_to_the_user("you have selected service: "+data_state.option_service_selected.val());
                                                      dispatcher.dispatch("service_selected", state_step, data_state,function(res,pipeline){console.log("service_selected!");});
                                                      
                                                  };
                                                  //                                              return endpointsOnChangeSelect(select_dom_id, data_state);
                                              }
                                              show_dom_select("#endpoints", "#suboperations", data_state.service_catalog_select,  the_on_change_select_fn, true)();
                                              callback(null, data_state);

                                          };

                                          // $('#tenants').fadeOut();
                                          show_fn_result_to_the_user_and_wait('Please select a service to use', 
                                                                              show_endpoints_select);


                                          
                                      },

               tenants:function (data_state, callback){
                   var state_step=this;
               function show_tenant_select(){


                   //                                          var select_dom_id=;
                   var the_dom_place_to_append_the_select='#suboperations';
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


           },

               actions:function(data_state, callback){
                   var target_pipeline=this.pipeline;
                   show_fn_result_to_the_user_and_wait("you are logged now!, please select an option: ", 
                                                       function(){
                                                           
                                                           $('#register_form').append("<div id='actions_available'><h2> actions available</h2></div><div id='suboperations'></div>").fadeIn(100, function(){
                                                               show_dom_select("#init_filter", "#actions_available",
                                                                               [{visible:"create server", hidden:"create_server"}, {visible:"listing resources", hidden:"listing_resources"}], 
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
               }
              
           };
           return common.naming_fns(result, "select_");

       });
