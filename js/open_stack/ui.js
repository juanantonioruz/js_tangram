define(["js/common.js","js/open_stack/events.js", "js/pipelines/dispatcher.js", "js/open_stack/model/tenant.js","js/open_stack/model/operation.js"],
       function(common, events, dispatcher, tenant_model, operation_model) {
function clean_interface(){
    $('#content').empty();
};
function show_message_to_the_user(the_message){

    $('#loading_results').html(the_message).css('background-color', 'aquamarine').fadeIn(500, function(){
        $('#loading_results')
            .fadeOut(2000);
    }
                                                                                        );
}

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
           };
           function show_fn_result_to_the_user_and_wait(the_message, the_function){

               $('#loading').fadeOut(1000, function(){
                   $('#loading')
                       .html(the_message)
                       .css('background-color', 'yellow')
                       .fadeIn(1000, the_function());
               }
                                    );
           };
           var result={
               empty_register_form:function(data_state, callback){
                    $('#register_form').fadeOut(500).empty().fadeIn();
                   callback(null, data_state);
               },
               register_form:function (data_state, callback){
                   var target_pipeline=this.pipeline;

                   $('#right').prepend("<h3 class='left_message'>show_register_form,  ...</h3>");
                   //


                   $('#left').append("<div id='register_form'><h3>Login: </h3>Open Stack IP (internal_ip:"+common.local_ip+",  external_ip: "+common.remote_ip+"): <input type='text' id='stack_ip' value='"+common.local_ip+"'><br> Stack User: <input type='text' id='stack_user' value='admin'><br> Password: <input type='password' id='stack_password' value='password'><br><input type='button' id='stack_logging' value='logging'></div>");
                   
                   $('#stack_logging').on('click', function(){

                       data_state.user=$('#stack_user').val();
                       data_state.password=$('#stack_password').val();
                       data_state.ip=$('#stack_ip').val();
                      
                       dispatcher.dispatch(events.try_to_log, target_pipeline,data_state );
                   });
                   callback(null, data_state);
               },
               create_server_options: function(data_state, callback){
                   //                    $('#tenants').fadeOut();
                   var me=this;
                   $('.user_input').remove();
                   $('#suboperations').append("<div id='user_form' class='user_input'><input type='text' id='server_name' value='test'></div>");

                   
                   $('#server_name').keypress( function(e){
                       if(e.which==13){
                           data_state.server_name=$('#server_name').val();
                           if(data_state.flavor_selected && data_state.image_selected && data_state.network_selected){
                               dispatcher.dispatch(events.send_create_server, me.pipeline, data_state);
                           }else
                           alert("select first network, image and flavor to create this server");
                       }else{

                           
                       }
                   });
                   callback(null, data_state);
               },
               create_subnet_options:function(data_state, callback){

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
                           dispatcher.dispatch(events.send_create_subnet, me.pipeline, data_state);

                       }else
                       alert("too short cidr or select the network circle!, try again please");

                   });
                   callback(null, data_state);
               },
               create_network_options:function(data_state, callback){

                   var me=this;
                   $('.user_input').remove();
                   $('#suboperations').append("<div id='user_form' class='user_input'><input type='text' id='network_name' value='test'></div>");

                   
                   $('#network_name').keypress( function(e){
                       if(e.which==13){
                           data_state.network_name=$('#network_name').val();
                           if(data_state.network_name.length>2){
                               dispatcher.dispatch(events.send_create_network, me.pipeline, data_state);

                           }else
                           alert("too short name, try again please");
                       }else{

                           
                       }
                   });
                   callback(null, data_state);
               },

               select_operations:function(data_state, callback){
                   var target_pipeline=this.pipeline;
                   show_fn_result_to_the_user_and_wait("please select an operation: ", 
                                                       function(){
                                                           $('#register_form').append("<div id='operations_available'><h2> operations available</h2></div><div id='suboperations'></div>").fadeIn(100, function(){
                                                               
                                                               show_dom_select(
                                                                   "#init_filter", 
                                                                   "#operations_available",
                                                                   [
                                                                       operation_model.operations_available.list.images,
                                                                       operation_model.operations_available.list.flavors,
                                                                       operation_model.operations_available.list.subnets,
                                                                       operation_model.operations_available.list.networks,
                                                                       operation_model.operations_available.list.servers,

                                                                       {visible:"create server", hidden:"create_server",item:{}},
                                                                       {visible:"create network", hidden:"create_network",item:{}},
                                                                       {visible:"create subnet", hidden:"create_subnet",item:{}}
                                                                   ], 
                                                                   function(select_dom_id){ 
                                                                       return function(){
                                                                           var jquery_obj=$(select_dom_id+" option:selected").first();


                                                                           
                                                                           operation_model.set_selected(data_state,{item:jquery_obj.data("item"), visible:jquery_obj.val()});

                                                                           var value_selected=jquery_obj.text();
                                                                           show_message_to_the_user("operation selected: "+value_selected);
                                                                           $('#right').prepend("<h3 class='left_message'>Loading "+value_selected+", please wait ...</h3>");
                                                                           $('#suboperations').fadeOut().html("").fadeIn();

                                                                           dispatcher.dispatch(events.operation_selected, target_pipeline,data_state );
                                                                       };
                                                                   },
                                                                   true)();
                                                               
                                                               callback(null, data_state);
                                                           });

                                                       });
               },
               select_tenants:function (data_state, callback){
                   var state_step=this;
                   function show_tenant_select(){
                       var the_dom_place_to_append_the_select='#register_form';
                       var the_on_change_select_fn=function(select_dom_id){
                           return function(){
                               $("#suboptions").remove();
                               var selected=$(select_dom_id+" option:selected").first();
                               tenant_model.set_selected(data_state, selected.data('item'));
                               clean_interface();
                               show_message_to_the_user("you have selected tenant: "+tenant_model.get_selected_name(data_state));
                               dispatcher.dispatch(events.tenant_selected, state_step, data_state );
                           };
                       };
                       show_dom_select("#tenants", the_dom_place_to_append_the_select,tenant_model.get_model(data_state),  the_on_change_select_fn, true)();
                       callback(null, data_state);
                   }

                   show_fn_result_to_the_user_and_wait('Please select a tenant to view its services available', 
                                                       show_tenant_select);
               }
           };
           return common.naming_fns(result, "ui_");
       });
