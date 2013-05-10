define(["js/behaviors/wellcome_context.js"], function(wellcome_context) {

// actually, this function returns an "pipeline_event(_data)" to pass through the pipeline
// in this  "pipeline_event(_data)" will inject the current_context (identified with key_context argument recieved),
// so this function can be thought in this way as  a contexts_service (his actual name)

// TODO:  additionally (and maybe we have to create a separate pipeline_event function for this) 
// the "pipeline_event(_data)" increase his functionality with properties and methods to store and read the pipeline 
// history or workflow [addStep, getStep, recordEndStep] 


//??  theoretically 
//??  this module has to access to all semantics contexts available in the app
//??  to inject the new functions with their dependencies    


    return  function(key_context, key_event){
        var pipeline_event={};

        pipeline_event.current_context=(key_context=="wellcome_context") ? wellcome_context : null;

        // init internal behavior history as an array
        pipeline_event.behavior_history=[];

        // a step is the result of a behavior!!
        pipeline_event.steps=[];

        pipeline_event.addStep=function(ns_behavior){
            var step={ns:ns_behavior, start:getStart()};
            pipeline_event.steps.push(step);};

        pipeline_event.getStep=function(ns_behavior){ 
            for(var i=0; i<pipeline_event.steps.length; i++){
                var step=pipeline_event.steps[i];
                if(ns_behavior==step.ns) return step;
            };
            throw "this behavior: '"+ns_behavior+"', doesn't exist in these pipeline steps";

        };

        pipeline_event.recordEndStep=function(ns_behavior){
            var the_step=pipeline_event.getStep(ns_behavior);
            return recordDiff(the_step);
        };

        // alias function
        pipeline_event.get_semantic_dom=pipeline_event.current_context.semantic_dom;

        // other alias  semantic_event as a property of pipeline_event object
        pipeline_event.semantic_event=pipeline_event.current_context.semantic_events[key_event];


        // this method has to get out from this place... only called currently to test aop from chains_manager
        pipeline_event.getBehaviorInstance=function(name){
            var b_arr=pipeline_event.semantic_event.behaviors_instances;
            for(var i=0; i<b_arr.length; i++){
                if(b_arr[i].data.ns==name) return b_arr[i];
                }
            throw "this behavior: '"+name+"', doesn't exist in behaviors instances of the current semantic_event";
        };
        pipeline_event.start=getStart();
        pipeline_event.recordDiff=function(){return recordDiff(pipeline_event); };
        return pipeline_event;
        
    };

    function getStart(){return (new Date).getTime();};
    function getDiff(start){return (new Date).getTime() - start;};
    function recordDiff(o){var dif=getDiff(o['start']); o['diff']= dif; return dif;};
    

});
