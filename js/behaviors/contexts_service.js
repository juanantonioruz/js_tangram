define(["js/behaviors/wellcome_context.js"], function(wellcome_context) {

// this module has to access to all semantics contexts available in the app
    function getStart(){return (new Date).getTime();};
    function getDiff(start){return (new Date).getTime() - start;};
    function recordDiff(o){var dif=getDiff(o['start']); o['diff']= dif; return dif;};
    return  function(key_context, key_event){
        var event={};

        event.current_context=(key_context=="wellcome_context") ? wellcome_context : null;

        // init internal behavior history as an array
        event.behavior_history=[];
        // a step is the result of a behavior!!
        event.steps=[];
        event.addStep=function(ns_behavior){
            var step={ns:ns_behavior, start:getStart()};
            event.steps.push(step);};
        event.getStep=function(ns_behavior){ 
            for(var i=0; i<event.steps.length; i++){
                var step=event.steps[i];
                if(ns_behavior==step.ns) return step;
            };
            //TODO throw an exception
            return null;
        };
        event.recordEndStep=function(ns_behavior){
            var the_step=event.getStep(ns_behavior);
            return recordDiff(the_step);

        };
        // alias function
        event.get_semantic_dom=event.current_context.semantic_dom;

        // other alias  semantic_event as a property of event object
        event.semantic_event=event.current_context.semantic_events[key_event];

        event.getBehaviorInstance=function(name){
            var b_arr=event.semantic_event.behaviors_instances;
            for(var i=0; i<b_arr.length; i++){
                if(b_arr[i].data.ns==name) return b_arr[i];
                }
            //TODO throw an exception
            return null;
        };
        event.start=getStart();
        event.recordDiff=function(){return recordDiff(event); };
        return event;
        
    };

    

});
