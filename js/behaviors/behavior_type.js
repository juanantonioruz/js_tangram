define(["js/fiber.min.js", "js/jquery-1.9.1.min.js"], function(Fiber) {


    var Behavior=Fiber.extend(function(){
        return  {
             init: function(name) {
                 this.data={};
                 this.data.ns=name;
                 this.on_start=[];
                 this.on_end=[];
                 // console.log("init behavior with this name:"+name);
             },
            behavior:function(event_data, callback){
//                console.log("PARENT METHOD:: That Means that is working inheritance in behavior functions");


//ATTENTION TO THIS!                callback(null, event_data); // if we invoke callback function then the compose async not working accurately
            }
        };

    });  


    Behavior.prototype.message=function(semantic_element, message){
         console.log(message);
        $(semantic_element).html(message);
    };



    Behavior.prototype.process=function(event_data, callback){
        var that=this;
        // here i am trying to throw an onStart event, but still dont know to whom
        event_data.current_context.semantic_dom.dispatcher.dispatch("ON_START",this.data.ns, event_data);




        (function(){
            function my_callback(error, results){
                event_data.behavior_history.push(that.data.ns);
                event_data.current_context.semantic_dom.dispatcher.dispatch("ON_END", that.data.ns, event_data);
                callback(error, results);
            }
            that.behavior(event_data, my_callback);
        })();
    };

    var B=  Behavior;
    return B;
});

