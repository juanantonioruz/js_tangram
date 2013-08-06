define( function() {
    function contains(context, search){
        return (context.indexOf(search) !== -1);
    }


    function getStart(){return (new Date).getTime();};
    function getDiff(start){return (new Date).getTime() - start;};
    function recordStart(o) {o['start']= getStart();};
    function recordDiff(o){var dif=getDiff(o['start']); o['diff']= dif; return dif;};

    function is_pipeline(ns){
        return  ns.indexOf("pipeline_")>-1;
    };
    function is_state_step(ns){
        return !is_pipeline(ns);
    };
    function is_on_init(event_type){
        return event_type=="ON_INIT";
    }

    function is_on_end(event_type){
        return event_type=="ON_END";
    }

    var debug_filters=false;

    function profiling(data_state, callback){
        if(debug_filters)    console.log(">profiling");
        var event_type=this.transformation_event_type;
        if(is_on_init(event_type)){
            recordStart(this.target);
            recordStart(data_state);
        }else if(is_on_end(event_type)){
            recordDiff(this.target);
            recordDiff(data_state);
        }
        callback(null, data_state);
    }

    function clone_data(data_state, callback){
        if(debug_filters)  console.log(">clone_data");
        var event_type=this.transformation_event_type;
        if(is_on_init(event_type)){
            this.target.before_data_state=$.extend(true, {}, data_state);

        }else if(is_on_end(event_type)){
            this.target.after_data_state=$.extend(true, {}, data_state);
        }
        callback(null, data_state);
    }

    function logging_filter(pipeline, state_step){
        return function(data_state, callback){
            if(debug_filters)  console.log(">logging");
            var event_type=this.transformation_event_type;
            var ns=this.target.ns;
            if((pipeline && is_pipeline(this.target.ns))|| (state_step && is_state_step(this.target.ns)) )
                console.log("-> "+ event_type+"/"+ns);

            callback(null, data_state);
        };
    }

    function d3_debug_pipelines_filter(render, div_id, item_fn, path){
        
        var active_pipelines=[];

        return function (data_state, callback){

            if(debug_filters)
                console.log(">--------------------------debug d3 pipelines");
            var ns=this.target.ns;
            var event_type=this.transformation_event_type;
            if(is_pipeline(ns)){
                if(is_on_init(event_type)){

                    if(active_pipelines.length>0)
                        this.target.active_parent=active_pipelines[active_pipelines.length-1];
                    else
                        this.target.active_parent=data_state;
                    
                    if(!this.target.parallel){
                        active_pipelines.push(this.target);
                    }


                }else if(is_on_end(event_type)){

                    if(!this.target.parallel){
                        var index=active_pipelines.indexOf(this.target);
                        active_pipelines.splice(index, 1);
                    }
                    this.target.active_parent.children.push(this.target);

                    if(active_pipelines.length==0)
                        render(data_state, div_id,item_fn, path);

                }else{
                    //active_pipelines.push(this.target);
                }
            }else{
                if(is_on_init(event_type)){

                }else{
                    this.target.pipeline.children.push(this.target);
                }
            }
            
            callback(null, data_state);
        };
    }

    function timming_filter(pipeline, state_step){
        return function(data_state, callback){
            if(debug_filters)      console.log(">show profiling");
            if((pipeline && is_pipeline(this.target.ns))|| (state_step && is_state_step(this.target.ns)) ){
                var history_message=this.transformation_event_type+"/"+
                        this.target.ns+((this.transformation_event_type=="ON_END")? " finished in "+this.target.diff+" ms":" ... timing ..." );
                if(contains(history_message, "state_step_")){
                    history_message=" -------- "+history_message;
                    if(this.transformation_event_type=="ON_END")
                        $('.left_message').last().fadeOut(200, function(){ $('.left_message').last().remove();});
                }else{
                    if(this.transformation_event_type=="ON_INIT"){
                        clean_history();
                    }else{

                        

                    }
                }
                
                $('#history_status').append("<li>"+history_message.replace("ON_", "")+"</li>");
            }
            callback(null, data_state);
        };
    }

    return {logging:logging_filter, d3_debug_pipelines:d3_debug_pipelines_filter, show_profiling:timming_filter, profiling:profiling, clone_data:clone_data};
});
