ONLINE-VERSION
===========
http://ancient-waters-4140.herokuapp.com/


Flow Simulation  
1. query server user_data (dashboard)  and convert to change_state_data  
2. body_change_state(change_state_data), its page_type is "object"  
   2.1 HIDDEN PROCESS Close modals  
3. inside body_manage_and_delegate if data page_type==object  pass to page_body(change_state) the control  
4. HIDDEN PROCESS( manage history and record data to dom and > manage_deletage_request)  
5. if(page_type==object) use template "page_object"  
6. site_pages_main(change_state, change_state_data)  
7. use tmpl 'activity_list' and put in sidebar.... this is the mail button at the right upper corner  
8. $('#object_editor').html(tmpl('component_loading'))   
9. query server with change_state_data.object_uri and obtain object_data  
10. $('#object_editor').html(tmpl('object_viewer', object_data.resources[0])  
11. ew_components_objectviewer(init, object_data.resources)  > here is processed all the data to display  
    11.1   navbar -> top navbar ::: $.tmpl('object_viewer_nav_with_header', object_data.resources);  
    11.2 process children div class=children ...   
    11.3 foreach children append new div with init plugin components_object_\[child.type\](child)  
12. END ew_components_objectviewer.content transition, page_body.fadeOut, pagebody.html(visual_data)  



TODO:
====
https://github.com/juanantonioruz/js_tangram/wiki/Todo

Usage
------

Run the app locally:
1. cd project
2. node server.js
3. you must have a openstack server listening in some port, in my case is 192.168.1.22



