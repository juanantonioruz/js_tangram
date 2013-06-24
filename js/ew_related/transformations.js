define(["js/common.js", "js/pipelines/dispatcher.js", "js/ew_related/json_data.js"],
       function(common, dispatcher, json_data) {
           function clone(object)
           {
               var newObj = (object instanceof Array) ? [] : {};
               for (var i in object)
               {
                   if (i == 'clone')
                       continue;
                   if (object[i] && typeof object[i] == "object")
                       newObj[i] = clone(object[i]);
                   else
                       newObj[i] = object[i];
               }
               return newObj;
           }
           function is_a_number(n) {
               return !isNaN(parseFloat(n)) && isFinite(n);
           }

           var load_tmpl={
               component:function(data_state, callback){

                   var tmpl_name="component_"+data_state.current_data.type;
                   var html=$.tmpl(tmpl_name, data_state.current_data);
                   var my_template=$.tmpl('my_template', data_state.current_data);
                   $(my_template).attr('id', data_state.current_data.id).append(html).append("<div>");
                   data_state.current_data.template=my_template;

                   callback(null, data_state);

               }
           };
           var component={
               
               text:function(data_state, callback){
                   var html;
                   if(data_state.current_data.editable)
                       html=$.tmpl('object_text', data_state.current_data);
                   else
                       html=$.tmpl('object_label', data_state.current_data);
                   data_state.current_data.template.html(html);
                   callback(null, data_state);
                   
               },
               image:function(data_state, callback){
                   var html = $.tmpl('object_image', data_state.current_data);
                   data_state.current_data.template.html(html);
                   callback(null, data_state);
                   
               },
               object:function(data_state, callback){
                   
                   callback(null, data_state);
                   
               }
           };


           var result= {
               alerta:function (data_state, callback){
                   alert("hola alerta!"+this.ns);
                   callback(null, data_state);
               },
               debug:function (data_state, callback){
                   console.dir(data_state);
                   callback(null, data_state);
               },
               
               check_current_state_is_active:function (data_state, callback){
                   console.log("current_state_is_still_active:: TODO: this logic could be get better if we try to do throught events, indeed there is already an event on finish 'body_change_state' ");
                   callback(null, data_state);
               },
               
               footer_update_breadcrumbs:function (data_state, callback){
                   
                   callback(null, data_state);
               },




               
               // this two must be moved to ui_prefix
               generate_uid:function(data_state, callback){
                   function create_id(prefix, subject) {
                       var id = prefix + "";
                       for (var x=0; x<subject.length; x++)
                           if(/^[a-zA-Z]$/.test(subject[x]))
                               id += subject[x];
                       id = id.toLowerCase();
                       return id;
                   }

                   function guid(){
                       var id = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(
                               /[xy]/g,
                           function(c){
                               var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);
                           }
                       );
                       return "id_" + id;
                   }

                   var object_id = (data_state.current_data.id != null)
                           ? create_id('object', data_state.current_data.id)
                           : guid();
                   
                   data_state.current_data.id=object_id;


                   callback(null, data_state);
               },
               by_child:function(data_state, callback){
                   
                   callback(null, data_state);
                   
               },
               component:function(data_state, callback){

                   callback(null, data_state);
                   
               }
           };
           
           
           
           var update={
               loading_object_editor:function (data_state, callback){
                   var oe= $('#page').find('#object_editor');

                   oe.html($.tmpl('component_loading', { loading_message: 'Loading_object_editor' }));
                   callback(null, data_state);
               },
               body_current_state_display_name:function (data_state, callback){
                   callback(null, data_state);
               }
               
           };

           var modals={
               init:function (data_state, callback){
                   callback(null, data_state);
               },
               close:function (data_state, callback){
                   callback(null, data_state);
               },
               render_search_results:function(data_state, callback){
                   var modal= $('body').find('#search_results_viewer');
                   modal.dialog({
                       modal: true,
                       width: $(window).width() - 200,
                       height: $(window).height() - 100,
                       draggable: false,
                       resizable: false
                   });

                   modal.find('.modal_close_button').click(function(){
                       $(this).parents('.modal_container').dialog('close');
                   });
                   modal.find(".modal_content").html("<p><b>TODO:</b>So far, only working close button</p>");
                 /*
                  TODO  connect this events--- and more from modal/search.js
                  modal.find('.search-query').keydown(function(event){

                       if (event.keyCode != 13)
                           return;

                       var search_box = $(this);

                       var search_term = search_box.val();

                       var search_data = modal.data('search_data');
                       if (search_data == null)
                           search_data = {};

                       search_data.search_term = search_term;

                   //    search_box.parents('.modal_container').enterpriseweb_site_modals_search('change_state',{ search_data: search_data });
                   });

                   modal.find('.navbar-search a#search_modal_search_button').click(function(event){
                       event.preventDefault();

                       var search_box = $(this).parent().find('input');

                       var search_term = search_box.val();

                       var search_data = modal.data('search_data');
                       if (search_data == null)
                           search_data = {};

                       search_data.search_term = search_term;

                   //    search_box.parents('.modal_container').enterpriseweb_site_modals_search('change_state',{ search_data: search_data });
                   });

                   modal.find('.navbar-search a#search_modal_reset_button').click(function(event){
                       event.preventDefault();

                       $(this).parent().find('input').val('');

                       setTimeout(function(){
                           $(this).parent().find('input').focus();
                       }, 2000);

                       var search_data = {};

                    //   $(this).parents('.modal_container').enterpriseweb_site_modals_search('change_state',{ search_data: search_data });
                   });
*/


                   callback(null, data_state);
               },
               render_your_history:function (data_state, callback){
                   var modal=$('#your_history');
                   modal.dialog({
                       modal: true,
                       width: $(window).width() - 500,
                       height: $(window).height() - 200,
                       draggable: false,
                       resizable: false
                   });

                   modal.find('#history_container').css('height', $(window).height() - 350);

                   modal.find('#aggregate_history_container').css('height', $(window).height() - 350);

                   modal.find('.modal_close_button').click(function(){
                       $(this).parents('.modal_container').dialog('close');
                   });

                   modal.find('#clear_state_history').click(function(){

                       alert("TODO $('body').enterpriseweb_site_structure_body('save_state_history_to_cookie', []);");
                       window.location.reload();
                   });
                   callback(null, data_state);
               }

           };

           var dao={
               load_data:function(data_state, callback){
                   $('#left').prepend("<p >(simulating )Loading json data!</p>");
                   setTimeout(function () {
                       data_state.json=json_data.example_data;
                       callback(null, data_state);
                   }, 250);
               },
               load_dashboard_data:function(data_state, callback){
                   var json=json_data.dashboard_data;
                   var user_data = {
                       uid: json.uid,
                       uri: json.uuri
                   };
                   $('body').data("user_data", user_data);
                   data_state.change_state_data = {
                       page_type: 'object',
                       state: 'object_view',
                       object_uri: user_data.uri
                   };

                   callback(null, data_state);
               },
               load_pages_main_data:function(data_state, callback){
                   var json=json_data[data_state.change_state_data.object_uri];
                   
                   data_state.main_data=json;
                   data_state.resource=json.body.resources[0];

                   //                   console.dir(data_state.resource);
                   callback(null, data_state);
               }
           };

           var renders={   
               object_viewer_header:function(data_state, callback){
                   $('#page').find('#object_editor')
                       .prepend(data_state.nav_template);
                   callback(null, data_state);},
               page:function(data_state, callback){

                   var template = $.tmpl('page_object');
                   $('#pagebody').empty().append(template);
                   callback(null, data_state);
               },
               modal:function(data_state, callback){
                   callback(null, data_state);
               },
               footer:function (data_state, callback){
                   var container = $('body').find('footer');
                   var that =this;
                   container.find('.where_are_we').css('max-width', $(window).width() -300);

                   //Attach the click handler to show full history
                   container.find('#show_history_link').click(function(){
                       dispatcher.dispatch("show_history", that, data_state);

                   });
                   callback(null, data_state);
               },
               header:function (data_state, callback){
                   var that =this;
                   var container=$('body').find('header');
                   container.find('#home_link').click(function(){
                       //reload cuurent request TODO: reimplement when the data will be available


                       dispatcher.dispatch("show_profile", that, data_state);

                   });


                   container.find('#main_search_box').keydown(function(event){
                       if (event.keyCode == 13){

                           event.preventDefault();

                           var search_term = $('#main_search_box').val();

                           data_state.change_state_data = {
                               page_type: 'modal',
                               state: 'main_search_results',
                               search_data: {
                                   search_term: search_term
                               }
                           };
                           dispatcher.dispatch("body_change_state", that, data_state);
                           // $('body').enterpriseweb_site_structure_body('change_state', change_state_data);
                       }
                   });

                   container.find('.navbar-search a').click(function(event){
                       event.preventDefault();

                       var search_term = $('#main_search_box').val();

                       data_state.change_state_data = {
                           page_type: 'modal',
                           state: 'main_search_results',
                           search_data: {
                               search_term: search_term
                           }
                       };
                       dispatcher.dispatch("body_change_state", that, data_state);
                       // $('body').enterpriseweb_site_structure_body('change_state', change_state_data);
                   });

                   container.find('.nav a').click(function(){
                       container.find('.nav li').removeClass('active');
                       $(container).addClass('active');
                   });


                   callback(null, data_state);
               },
               

               task:function(data_state, callback){
                   callback(null, data_state);
               },
               activity_list:function(data_state, callback){
                   callback(null, data_state);
               },
               clean_trays:function(data_state, callback){
                   callback(null, data_state);
               },
               trays:function(data_state, callback){
                   callback(null, data_state);
               }
               
           };

           var templates={
               load_object_viewer:function(data_state, callback){
                   //    console.log("loading 'object_viewer' template with this resource: "+data_state.resource);
                   var content_templates_container = $("<ul></ul>");
                   data_state.object_viewer_template=content_templates_container;
                   $('#page').find('#object_editor').html(content_templates_container);
                   callback(null, data_state);
               },
               load_object_viewer_with_header:function(data_state, callback){
                   var object=data_state.resource;
                   var object_view=$('#page').find('#object_editor');
                   var nav_template = $.tmpl('object_viewer_nav_with_header', object);
                   nav_template.find('.nav li:first').addClass('active');



                   data_state.nav_template=nav_template;
                   var header_template = ($.template['object_viewer_content_' + object.type] != null)
                           ? $($.tmpl('object_viewer_content_' + object.type, object))
                           : $($.tmpl('object_viewer_content', object));

                   header_template.data('object', object.header);

                   header_template.css('height', object_view.height());

                   header_template.removeClass('hide');

                   header_template.addClass('header_' + object.type);

                   var children_template = $('<div class="children"></div>');

                   header_template.append(children_template);

                   object_view.find('ul').append(header_template);

                   callback(null, data_state);
               },
               load_object_viewer_without_header:function(data_state, callback){
                   var object=data_state.resource;

                   var nav_template = $.tmpl('object_viewer_nav', object);
                   data_state.nav_template=nav_template;

                   callback(null, data_state);
               },
               configure_object_viewer_header:function(data_state, callback){
                   callback(null, data_state);
               },
               object_viewer_header_error:function(data_state, callback){
                   callback(null, data_state);
               }
               ,object_viewer_header_function:function(data_state, callback){
                   callback(null, data_state);
               }
               ,

               render_object_viewer_header:function(data_state, callback){


                   // var object=data_state.resource;
                   //                   console.dir(data_state.resource);
                   

                   var oe=$('#object_editor');

                   //TODO improve this ... still i dont know in wich place find this functionality
                   oe.find('.object_viewer_content').css('height', "300px");

                   
                   callback(null, data_state);
               },
               load_object_viewer_child:function(data_state, callback){

                   //  console.dir(data_state.current_data);
                   // var object=data_state.resource;
                   //                   console.dir(data_state.resource);
                   
                   var children_template=$('#object_editor').find('.object_viewer_content').find('.children');


                   var child_template = $('<div></div>');
                   children_template.append(child_template);
                   data_state.current_data.template=child_template;
                   
                   callback(null, data_state);
               }
               
           };
           


           var cache_data={
               page_body:function(data_state, callback){
                   // console.log("TODO");
                   callback(null, data_state);
               },
               object_viewer:function(data_state, callback){
                   //var r=data_state.get_value("resource.header.children[0].value");
                   //alert(common.toJson(r));
                   callback(null, data_state);
               },
               object_viewer_header:function(data_state, callback){
                   callback(null, data_state);
               },
               object_viewer_header_child:function(data_state, callback){
                   callback(null, data_state);
               }


           };
           
           var validation={
               key_up:function(data_state, callback){
                   callback(null, data_state);
               },
               click:function(data_state, callback){
                   callback(null, data_state);
               },
               is_phone_number:function(data_state, callback){
                   callback(null, data_state);
               },
               is_date:function(data_state, callback){
                   callback(null, data_state);
               },
               is_mail:function(data_state, callback){
                   callback(null, data_state);
               }
           };

           var actions={
               component_a:function(data_state, callback){
                   callback(null, data_state);
               }
           };

           var metadata={
               component_m:function(data_state, callback){
                   callback(null, data_state);
               }
           };

           var state_history={
               init:function (data_state, callback){
                   var body = $('body');

                   //Get any state history from the cookie
                   var state_history_from_cookie = $.cookie('state_history');

                   //Check to see if there is any history
                   if (state_history_from_cookie !== undefined) {

                       //Parse from json
                       var state_history = JSON.parse(state_history_from_cookie);

                       //Add the cookie persisted state history to the data
                       body.data('state_history', state_history);
                   }else {

                       //Create the state history as an empty array
                       //                var state_history = [];

                       //Add this to the data
                       body.data('state_history', []);

                       //Create a new cookie for it
                       $.cookie('state_history', JSON.stringify(state_history), { expires:365, path:'/', json:true });
                   }


                   callback(null, data_state);
               },
               prepare:function (data_state, callback){
                   var data=data_state.change_state_data;

                   var state_history = $('body').data('state_history');

                   if (state_history.length >= 11)
                       state_history.splice(0, state_history.length - 10);

                   var index_of_active_state = state_history.length - 1;

                   //Loop through all the state items
                   $.each(state_history, function(index, item){

                       //Only interested in active items
                       if (!item.active)
                           return;

                       //Set the index of active state for later
                       index_of_active_state = index;

                       //Mark each as inactive
                       item.active = false;
                   });


                   //If the state change is up or down the state history
                   if (is_a_number(data)) {

                       //Ensure the data value is a int
                       var index = parseInt(data);

                       //Extract the intended state from the state history array
                       data = clone(state_history[index]);
                   }
                   else {

                       //This is a new state and wont have a display name so show the spinning icon
                       data.display_name = "<img src='../pix/logo_ew_single_star_grey.png' class='icon-spin'/>";
                   }

                   //Add the data to the state history
                   state_history[state_history.length] = data;

                   //Mark the new state as active
                   data.active = true;

                   //set the start time
                   data.time_in = new Date();

                   //set the time out too - note: this is reset every minute in the init function of the body
                   data.time_out = new Date();
                   data_state.state_history=state_history;
                   callback(null, data_state);
               },
               save_to_cookie:function(data_state, callback){
                   var state_history=data_state.state_history;
                   $('body').data('state_history', state_history);
                   $.cookie('state_history', JSON.stringify(state_history), { expires:365, path:'/', json:true });
                   callback(null, data_state);
               }
               
           };

           var relationships={
               object_viewer_header:function(data_state, callback){
                   //var r=data_state.get_value("resource.header.children[0].value");
                   //alert(common.toJson(r));
                   callback(null, data_state);
               }
           };


           return {
               component:common.naming_fns(component, "component_"),
               validation:common.naming_fns(validation, "validation_"),
               actions:common.naming_fns(actions, "actions_"),
               metadata:common.naming_fns(metadata, "metadata_"),
               load_tmpl:common.naming_fns(load_tmpl, "load_tmpl_"),
               templates:common.naming_fns(templates, "template_"),
               update:common.naming_fns(update, "update_"),
               state_history:common.naming_fns(state_history, "state_history_"),
               relationships:common.naming_fns(relationships, "relationships_"),
               dao:common.naming_fns(dao, "dao_"),
               modals:common.naming_fns(modals, "modals_"),
               transformations:common.naming_fns(result),
               renders:common.naming_fns(renders, "render_"),
               cache_data:common.naming_fns(cache_data, "cache_data_")};

       });
