define(["js/common.js","js/open_stack/events.js", "js/pipelines/dispatcher.js"],
       function(common, events, dispatcher) {
           var result={};

           result.ey=function(data_state, callback){
               console.log("helper MOCKKKKK _ey function");
               callback(null, data_state);
           };

           return common.renaming_fns(result, "helper_");
       }
      );
