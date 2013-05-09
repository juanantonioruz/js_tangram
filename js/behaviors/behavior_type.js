define(["js/fiber.min.js", "js/jquery-1.9.1.min.js"], function(Fiber) {

    var Animal = Fiber.extend(function() {
               return {
                   // The `init` method serves as the constructor.
                   init: function(name) {
                       this.name=name;
                 //      console.log("inside init animal");
                       // Private
                       function private1(){}
                       function private2(){}

                       // Privileged
                       this.privileged1 = function(){};
                       this.privileged2 = function(){};
                   },
                   // Public
                   method1: function(){
                       console.log("inside method1 animal"+this.name);
                   }
               };
           });

           
    var Dog = Animal.extend(function(base) {
        return {
            init: function() {
                base.init();
             //   console.log("inside init dog");
                // Private
                
            },
            // Override base class `method1`
            method1: function(){
                console.log('dog::method1');
            },
            scare: function(){
                console.log('Dog::I scare you');
            }
        };
    });
//TODO: remove all these examples
    this.a=new Animal("doggy");
   Animal.prototype.message=function(){this.method1();};

    this.c=new Animal("guau!");
    this.b=new Dog();




    var Behavior=Fiber.extend(function(){
        return  {
             init: function(name) {
                 this.data={};
                 this.data.ns=name;
                 this.on_start=[];
                 this.on_end=[];
                 console.log("init behavior with this name:"+name);
             },
            behavior:function(event_data, callback){
                console.log("PARENT METHOD");
//                callback(null, event_data);
            }
        };

    });  


  

    // // Behavior.prototype.data={};
    // // Behavior.prototype.data.ns=name;
    //  Behavior.prototype.on_start=[];
    //  Behavior.prototype.on_end=[];

    Behavior.prototype.message=function(semantic_element, message){
         console.log(message);
        $(semantic_element).html(message);
    };



    Behavior.prototype.process=function(event_data, callback){
        var that=this;
        // here i am trying to throw an onStart event, but still dont know to whom
        event_data.current_context.semantic_dom.dispatcher.dispatch("ON_START: "+this.data.ns, event_data);

        event_data.behavior_history.push(this.data.ns);

        $('#status').html("init: "+this.data.ns);
        (function(){
            function my_callback(error, results){
                event_data.current_context.semantic_dom.dispatcher.dispatch("ON_END: "+that.data.ns, event_data);
                callback(error, results);
            }
            that.behavior(event_data, my_callback);
        })();
    };

    var B=  Behavior;
    return B;
});
