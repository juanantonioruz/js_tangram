define(["js/common.js","js/pipelines/dispatcher.js"],
       function(common, dispatcher) {
           var result= {
               good_morning_fn:
               function(data_state, callback){
                   setTimeout(function () {
                       var user_history=[];
                       user_history.push("take a shower");
                       user_history.push("have breakfast");
                       data_state.history.push.apply(data_state.history, user_history);
                       callback(null, data_state);
                   }, 250);
               },

               good_afternoon_fn:function(data_state, callback){
                   setTimeout(function () {
                       var user_history=[];
                       user_history.push("have lunch");
                       user_history.push("have a nap");
                       data_state.history.push.apply(data_state.history, user_history);
                       callback(null, data_state);
                   }, 250);
               },

               good_night_fn:function(data_state, callback){
                   setTimeout(function () {
                       var user_history=[];
                       user_history.push("have dinner");
                       user_history.push("go to bed");
                       data_state.history.push.apply(data_state.history, user_history);
                       // to throw an error                    callback("that's an error!!", data_state);
                       callback(null, data_state);
                   }, 250);
               },
               
               the_slower_fn:function(data_state, callback){
                   setTimeout(function () {
                       var user_history=[];
                       user_history.push("i am the slowest");
                       data_state.history.push.apply(data_state.history, user_history);
                       callback(null, data_state);
                   }, 2000);
               },

               active_gn_button:function (data_state, callback){
                   var state_step=this;
                   $('#start_pipeline').prop("value", "good_night!").off('click').click(
                       function(){
                           dispatcher.dispatch("start_night", state_step, data_state );
                       });
                   callback(null, data_state);
               }
               

           };
           return common.naming_fns(result, "dev_");
       });
