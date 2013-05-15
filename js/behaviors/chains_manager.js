define(
    ["js/behaviors/compose_async.js",
     "js/behaviors/pipeline_event.js",
     "js/behaviors/welcome_context.js"
    
    ], 
    function(start_pipeline, 
             pipeline_event, 
             welcome_context) {


        //AOP in any code place and in any runtime time
        // the ideal would be defined in json style in corresponding context 

        // so far we have only one context... at medium term it will change to access a context factory map
       
        welcome_context.apply( "show_history.template_history",  "ON_START", "show_history.show_user_history");
        welcome_context.apply( "show_history.attach_behaviors",  "ON_END", "show_history.show_user_history");


        var onSuccessCallback=function(eventFinishChain){

            highlightStatus("all steps in pipeline are done! in "+eventFinishChain.diff +" ms ... of: "+eventFinishChain.pipeline_context_ns);

        };
        var onErrorCallback=function(e){
            highlightStatus("error"+toJson(e));
        };
        var chains_mapping={
            show_history: function (){
                start_pipeline(pipeline_event(null,  welcome_context, 'show_history'),onSuccessCallback, onErrorCallback);  
            },
             start: function(){
                 start_pipeline(pipeline_event(null,  welcome_context, 'start') ,onSuccessCallback, onErrorCallback);         
             },
            start_bis: function(){
                 start_pipeline(pipeline_event(null,  welcome_context, 'start_bis') ,onSuccessCallback, onErrorCallback);         
            }
            
        };

        uijuan.chains_manager=chains_mapping;


        return chains_mapping; 
    

    });

