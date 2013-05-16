define(
        function() {
            return {
        jqueryIterateAndDisplay:function jqueryIterateAndDisplay(target_dom_id, title, model){

                $(target_dom_id).append("<h1>"+title+"</h1><ul></ul>");
                $.each(model, function(i, value){
                    $(target_dom_id+' ul').append("<li>"+value+"</li>");
                });
            },

           jqueryIterateAndDisplayHistoryStep: function jqueryIterateAndDisplayHistoryStep(target_dom_id, title, step, model_property){
                $(target_dom_id).append("<ul id='"+step.ns+"'><li><b>"+title+"</b>"+
                                        "<ul><li>Data State Step Before<ul></ul></li>"+
                                        "<li>Data State Step After (Time elapsed: "+step.diff+" ms)<ul></ul></li></ul></li></ul>");
                $.each(step.before_data_state[model_property], function(i, value){
                    $("#"+step.ns).find('li ul li ul').first().append("<li>"+value+"</li>");
                });
                $.each(step.after_data_state[model_property], function(i, value){
                    $("#"+step.ns).find('li ul li ul').last().append("<li>"+value+"</li>");
                });

            }
};});
