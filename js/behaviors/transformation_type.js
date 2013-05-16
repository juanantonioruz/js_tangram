define(["js/fiber.min.js", "js/jquery-1.9.1.min.js"], function(Fiber) {


    var Transformation=Fiber.extend(function(){
        return  {
             init: function(name) {
               //  this.data={};
               //  this.data.ns=name;

                 // console.log("init behavior with this name:"+name);
             },
            behavior:function(event_data, callback){
                //console.log("PARENT METHOD:: That Means that is working inheritance in behavior functions");

                //ATTENTION TO THIS!                callback(null, event_data); 
                // if we invoke callback function then the compose async not working accurately, IT SEEMS IT IS based in the number of functions chained to maintain chain
            }
        };

    });  


    Transformation.prototype.message=function(semantic_element, message){
         console.log(message);
        $(semantic_element).html(message);
    };


    Transformation.prototype.process=function(event_data, callback){
        var that=this;
        event_data.current_context.semantic_dom.dispatcher.dispatch("ON_START",this.ns, event_data);
        (function(){
            function my_callback(error, results){
                event_data.current_context.semantic_dom.dispatcher.dispatch("ON_END", that.ns, event_data);
                callback(error, results);
            }
            that.behavior(event_data, my_callback);
        })();
    };

    return Transformation;
});
