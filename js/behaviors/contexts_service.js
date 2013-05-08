define(["js/behaviors/wellcome_context.js"], function(wellcome_context) {

// this module has to access to all semantics contexts available in the app

    return  function(key_context, key_event){
        var event={};

        event.current_context=(key_context=="wellcome_context") ? wellcome_context : null;

        // init internal behavior history as an array
        event.behavior_history=[];

        // alias function
        event.get_semantic_dom=event.current_context.semantic_dom;

        // set semantic_event as a property of event object
        event.semantic_event=event.current_context.semantic_events[key_event];

        return event;
        
    };

    

});
