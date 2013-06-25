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
           function guid(){
               var id = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(
                       /[xy]/g,
                   function(c){
                       var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);
                   }
               );
               return "id_" + id;
           }
           var component={
               generic:function(data_state, callback){

                   callback(null, data_state);
                   
               },
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

                   

                   var object_id = (data_state.current_data.id != null)
                           ? create_id('object', data_state.current_data.id)
                           : guid();
                   
                   data_state.current_data.id=object_id;


                   callback(null, data_state);
               }
           };
           
           /*rest of functions, theoritecally they must be moved from here*/
           var transformations= {
               window_location_reload:function (data_state, callback){
                   window.location.reload();
                   
                   callback(null, data_state);
               },
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
               }

               
           };
           
           /*update existing templates or html components */
           var update={
               footer_breadcrumbs:function (data_state, callback){
                   var that=this;
                   var state_history=$('body').data('state_history');
                   var container = $('body').find('footer');

                   var history_container = container.find('#breadcrumbs');

                   history_container.html('');
                   // console.log("before");
                   // console.dir(state_history);
                   $.each(state_history, function(index, item){
                       // console.log("inside");
                       // console.dir(item);
                       //Dont show modals in the breadcrumbs
                       if (item.page_type == 'modal')
                           return;

                       //Dont show duplicates in the breadcrumbs
                       if (index > 0 && item.display_name == state_history[index - 1].display_name)
                           return;

                       //if not the last item but has loading then don't show
                       if (index < state_history.length && item.display_name != null && item.display_name.indexOf("icon-spin") > 0)
                           return;

                       //Add the divider
                       if (index > 0 && index < state_history.length)
                           history_container.prepend("<i class='icon-stop'></i>");
                       //history_container.prepend("<i class='icon-caret-right'></i>");

                       //Build the template depending on the active state of the state item
                       var template = $('<span class="state">' + item.display_name + '</span>');

                       //Add the data to drive the click function
                       template.data('state_index', index);

                       //Append the template to the container
                       history_container.prepend(template);

                       //Attach the click handler
                       template.click(function(){

                           //Get a handle on the clicked element
                           var element = $(this);

                           //If this is the active one, do nothing
                           if (element.is('.active'))
                               return;

                           //Get the state change index
                           var state_index = element.data('state_index');

                           //Call the state change function on the body
                           // $('body').enterpriseweb_site_structure_body('change_state', state_index);
                           dispatcher.dispatch("body_change_state", that, data_state);
                       });
                   });

                   history_container.find('.state:first').addClass('active');




                   callback(null, data_state);
               },
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
               }

           };

           /*dao*/
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
                   data_state.resource_trays=json.body.trays;
                   //                   console.dir(data_state.resource);
                   callback(null, data_state);
               }
           };

           /* onclick event dispatcher and display logic jquery   */
           var renders={   
               footer:function (data_state, callback){
                   var container = $('body').find('footer');
                   var that =this;
                   container.find('.where_are_we').css('max-width', $(window).width() -300);

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
               
               modal_search_results:function(data_state, callback){
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
               modal_your_history:function (data_state, callback){
                   var that=this;
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
                       dispatcher.dispatch("clear_history", that, data_state);

                   });
                   
                   callback(null, data_state);
               },

               task:function(data_state, callback){
                   callback(null, data_state);
               },
               activity_list:function(data_state, callback){
                   var activity_list = $.tmpl('activity_list');

                   //Add it to the sidebar
                   $('#page').find('sidebar').html(activity_list);
                   var container = activity_list;

                   container.find('.list_container').css('height', $(window).height() - 175);
                   
                   container.parents('sidebar:first')
                       .mouseenter(function(){
                           //$(this).data('opacity', $(this).css('opacity'));
                           var sidebar = $(this);
                           if (sidebar.is('.expanding'))
                               return;
                           sidebar.addClass('expanding');
                           if (sidebar.data('right') == null)
                               sidebar.data('right', sidebar.css('right'));
                           sidebar.css('background', 'rgba(251,251,251,0.7)');
                           sidebar.css('z-index', 11);
                           sidebar.animate({ right: -15  }, 200, function(){
                               sidebar.removeClass('expanding')
                           });
                           sidebar.find('.list_container').fadeIn();

                       })

                       .mouseleave(function(){
                           //$(this).animate({ opacity: $(this).data('opacity') }, 500);
                           var sidebar = $(this);
                           if (sidebar.is('.retracting'))
                               return;
                           sidebar.addClass('retracting');
                           sidebar.find('.list_container').hide();
                           sidebar.css('z-index', 8);
                           sidebar.animate({ right: sidebar.data('right') }, 200, function(){
                               sidebar.css('background', 'none');
                               sidebar.removeClass('retracting');
                           });
                       })

                       .click(function(){
                           $(this).mouseleave();
                       });
                   if (container.find('.activity_list_item').length > 0)
                       console.log("return now");
                   else
                       console.log("TODO: dao activityList");
                   callback(null, data_state);
               }
               
               
               
               
           };

           /* dynamic templates and html composition   */
           var templates={
               load_object_object:function(data_state, callback){
                   var container=data_state.current_data;
                   console.dir(container);
                   console.log("search where is setted this value .data('object')");
                   // var object = container.data('object');
                   
                   // //Load the template
                   // var template = $.tmpl('object_object', object);

                   // //Add the template to the container
                   // container.html(template);

                   callback(null, data_state);
                   },
               foreach_create_object:function(data_state, callback){
                   // var container=data_state.current_data;
                   // console.log("must be foreach");
                   callback(null, data_state);
                   },
               load_body_object_object_viewer:function(data_state, callback){
                   data_state.y=data_state.current_data.children;
                   var object_view=$('#page').find('#object_editor');
                   var content_templates_container=data_state.object_viewer_template;
                var child = data_state.current_data;

                var content_template = $($.tmpl('object_viewer_content', child));

                content_template.data('object', child);

                content_template.css('height', object_view.height());

                if (content_templates_container.children().length == 0)
                    content_template.removeClass('hide');

                content_templates_container.append(content_template);

                   callback(null, data_state);
               },
               load_object_viewer:function(data_state, callback){
                   //    console.log("loading 'object_viewer' template with this resource: "+data_state.resource);
                   var content_templates_container = $("<ul></ul>");
                   data_state.object_viewer_template=content_templates_container;
                  
                   $('#page').find('#object_editor').html(content_templates_container);
                   callback(null, data_state);
               },
               load_object_viewer_with_header:function(data_state, callback){
                   var that=this;
                   var object=data_state.resource;
                   var object_view=$('#page').find('#object_editor');
                   var content_templates_container=data_state.object_viewer_template;
                  
                   var nav_template = $.tmpl('object_viewer_nav_with_header', object);
                   nav_template.find('.nav li:first').addClass('active');


                   nav_template.find('.nav li a').click(function(){


                       var link = $(this);

                       var all_lis = nav_template.find('.nav li');

                       for(var x=0; x<all_lis.length; x++)
                           $(all_lis[x]).removeClass('active');

                       link.parent().addClass('active');

                       var target_id = link.data('target_id');

                       object_view.find('.object_viewer_content').fadeOut(500, function(){
                           setTimeout(function() {

                               object_view.find('.object_viewer_content').each(function(){
                                   var object_viewer_content = $(this);
                                   if(object_viewer_content.data('target') == target_id)
                                       object_viewer_content.fadeIn(500, function(){
                                           console.dir(object_viewer_content.data('object'));
                                          data_state.resource=object_viewer_content.data('object');
                                           dispatcher.dispatch("update_object_viewer", that, data_state);
                                           //  REPLACED with this                                    object_viewer_content.enterpriseweb_site_components_object(object_viewer_content.data('object'));
                                       });
                               });
                           }, 500);
                       });
                   });


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


                   /*
               render_body_objects _____ foreach object.children
                    render_body_object ____ pipe current_data
                    --- load_template  and cache_data and configure_css and  add_to_parent_container
                    --- switch if has children
                    -------  false:::: return
                    -------  true::::  pipe 
                    ------------------------ load_object_object_template
                    ------------------------walk_childs for_each_child
                    -----------------------  --- acces_parent_container
                    -----------------------  --- walk_children ___ for_each
                    ----------------------------- render_component
                                     //  var object=data_state.resource;
//                   var content_templates_container=data_state.object_viewer_template;

            for (var x=0; x<object.children.length; x++) {

                var child = object.children[x];

                var content_template = $($.tmpl('object_viewer_content', child));

                content_template.data('object', child);

                content_template.css('height', object_view.height());

                if (content_templates_container.children().length == 0)
                    content_template.removeClass('hide');

                content_templates_container.append(content_template);
                
//TODO                 content_template.enterpriseweb_site_components_object(child);

// COMMENTED IN SOURCE               var children_container = content_template.find('.children');
//
//                if (child.children != null)
//                    for (var y=0; y<child.children.length; y++){
//                        var object_container = $('<div></div>');
//                        children_container.append(object_container);
//                        object_container.enterpriseweb_site_components_object(child.children[y]);
//                    }
//                else
//                    content_template.append($.tmpl('object_viewer_error'));
            }

                    
                    */

                   callback(null, data_state);
               },
               load_object_viewer_without_header:function(data_state, callback){
                   var object=data_state.resource;

                   var nav_template = $.tmpl('object_viewer_nav', object);
                   data_state.nav_template=nav_template;
                   
                   callback(null, data_state);
               },
               
               object_viewer_header_error:function(data_state, callback){
                   console.log("TODO");
                   callback(null, data_state);
               },
               object_viewer_header_function:function(data_state, callback){
                   console.log("TODO");
                   callback(null, data_state);
               },
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
                   //console.dir(children_template);
                   
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

                   $('#page').find('#object_editor').find(".object_viewer").data('object', data_state.resource);
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
                   //      console.dir(state_history);
                   callback(null, data_state);
               },
               update_current_name:function(data_state, callback){
                   // GET A HANDEL ON THE BODY
                   var body = $('body');

                   //Get a handel on the state history
                   var state_history = body.data('state_history');

                   //Loop through the state history setting the display name for the active state
                   $.each(state_history, function(index, item){

                       //If this is the active state then set the display name
                       if (item.active)
                           item.display_name = data_state.resource.display_name;

                   });


                   


                   // the merge_duplicates body.js method has been moved inside this


                   var new_state_history = [];

                   //Loop through the list looking for duplicates
                   $.each(state_history, function(index, item){

                       if (new_state_history.length > 0) {

                           var previous_state_history_entry = new_state_history[new_state_history.length - 1];

                           if (previous_state_history_entry.display_name == item.display_name){

                               previous_state_history_entry.time_out = item.time_out;

                               return;
                           }
                       }

                       new_state_history[new_state_history.length] = item;
                   });



                   data_state.state_history=new_state_history;

                   body.data('state_history', new_state_history);

                   
                   callback(null, data_state);
               },
               clear_history:function(data_state, callback){
                   data_state.state_history=[];

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

           var trays={
               clean:function(data_state, callback){
                   var container=$('#trays');
                   //Remove any exisring tray
                   container.html('');

                   callback(null, data_state);
               },
               init_child:function(data_state, callback){

                   var tray=data_state.current_data;



                   var extension=tray.type;
                   data_state.current_data.tray_type=extension;                   
                   try{

                       tray.unique_id = "tray_" + guid();

                       //Build the tray header template
                       var template = $.tmpl('tray_header', tray);
                       //console.dir(data_state.current_data.type);
                       data_state.current_data.template=template;
                       //Pass off control to the code that matches the type of this object
                       // template[jquery_extension_function]('render', tray);
                       



                       callback(null, data_state);                       

                   }catch(error){
                       callback(error, data_state);                       
                       alert(error+"--->"+extension);
                   }


               },
               draggable_search:function(data_state, callback){
                   //        data_state.current_data.template.append("<h1>search</h1>");

                   var container = data_state.current_data.template;
                   var tray_data=data_state.current_data;
                   //Add the tray data to the container
                   container.data('draggable_search_tray_data', tray_data);

                   //Build the search data
                   var search_data = {
                       search_term:'',
                       pagination: { page : 0, rows: 25, sort: 'ID', sortDir: 'asc' },
                       selected_facets: []
                   };

                   //Augment the search data
                   for (key in tray_data.search_data)
                       search_data[key] = tray_data.search_data[key];

                   //Store the search data
                   container.data('search_data', search_data);

                   //Attach to the parent moving event and auto select the results tab
                   $('#' + container.attr('id') + '.moving').livequery(function(){

                       $(this).find('.tray_draggable_search_tabs > ul li:first a').click();
                   });

                   //Attach to the showing of the tray_content
                   $('#' + container.attr('id') + ' .tray_content:visible').livequery(function(){
                       var tray_content = $(this);

                       var draggable_tray_items_container = tray_content.find('.draggable_tray_items_container');
                       var relative_top = draggable_tray_items_container.offset().top - tray_content.offset().top;
                       draggable_tray_items_container.height(tray_content.height() - relative_top - 20);
                       tray_content.find('.tray_draggable_search_filters').height(tray_content.height() - relative_top - 20);
                   });

                   //Run the search for the first time
                   //  container.enterpriseweb_site_components_trays_draggable_search('run_search');
                   console.log("TODO: run search");
                   //return the container


                   callback(null, data_state);

               },
               draggable_list:function(data_state, callback){
                   //  TODO                 data_state.current_data.template.append("<h1>list</h1>");
                   callback(null, data_state);
               },
               set_top:function(data_state, callback){
                   var index=data_state.current_data._index_;
                   //Set the css top
                   var template=data_state.current_data.template;
                   var container=$('#trays');
                   //Append the tray to the container
                   container.append(template);

                   template.css('top', (112 + index * 56) + 'px');


                   //var tray=data_state.current_data;
                   template
                       .mouseenter(function(){
                           var tray = $(this);
                           tray.addClass('mouseenter');
                           if (tray.is('.moving') || tray.is('.pinned') || tray.is('.popped_out'))
                               return;
                           if (tray.data('right') == null)
                               tray.data('right', tray.css('right'));
                           if (tray.data('top') == null)
                               tray.data('top', tray.css('top'));
                           tray.css('right', '-200px');
                           tray.addClass('popped_out');

                           setTimeout(function(){
                               if (!tray.is('.mouseenter'))
                                   tray.mouseleave();
                           }, 1000);
                       })

                       .bindWithDelay('mouseleave', function(){
                           var tray = $(this);
                           if (tray.is('mouseenter') || tray.is('.moving') || tray.is('.pinned') || tray.is('.dragging'))
                               return;
                           tray.removeClass('mouseenter');
                           tray.css('background', '');
                           tray.find('.tray_content')
                               .hide()
                               .height(0);

                           tray.css('right', tray.data('right'));
                           tray.removeClass('popped_out');
                       }, 500)

                       .find('.navbar').click(function(){

                           var button = $(this).find('.pin_button'); 
                           var tray = button.parents('.tray:first');
                           var all_trays = $('.tray, sidebar');
                           if (button.is('.active')) {
                               tray.removeClass('pinned');
                               button.removeClass('active');
                               all_trays.css('z-index', 10);
                               tray.css('right', tray.data('right'));
                               tray.css('background', '');
                               tray.find('.tray_content')
                                   .hide()
                                   .height(0);
                           }
                           else {
                               tray.addClass('pinned');
                               button.addClass('active');
                               tray.css('background', 'rgba(256, 256,256, 0.9');
                               tray.find('.tray_content')
                                   .height($(window).height() - tray.offset().top - 120)
                                   .show();
                               tray.animate({ right: -15 }, 200);
                               all_trays.css('z-index', 9);
                               tray.css('z-index', 10);
                           }
                       });

                   callback(null, data_state);
               }
           };

           return {
               trays:common.naming_fns(trays, "trays_"),
               component:common.naming_fns(component, "component_"),
               validation:common.naming_fns(validation, "validation_"),
               actions:common.naming_fns(actions, "actions_"),
               metadata:common.naming_fns(metadata, "metadata_"),

               templates:common.naming_fns(templates, "template_"),
               update:common.naming_fns(update, "update_"),
               state_history:common.naming_fns(state_history, "state_history_"),
               relationships:common.naming_fns(relationships, "relationships_"),
               dao:common.naming_fns(dao, "dao_"),
               modals:common.naming_fns(modals, "modals_"),
               transformations:common.naming_fns(transformations),
               renders:common.naming_fns(renders, "render_"),
               cache_data:common.naming_fns(cache_data, "cache_data_")};

       });
