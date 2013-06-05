define( function() {
function debug_pipelines(render, div_id){
    return function (data_state, callback){
        var ns=this.target.ns;
        
        var event_type=this.transformation_event_type;
        if(ns.indexOf("pipeline_")>-1){
            if(event_type=="ON_INIT"){

                if(data_state.active_pipelines.length>0)
                    this.target.active_parent=data_state.active_pipelines[data_state.active_pipelines.length-1];
                else
                    this.target.active_parent=data_state;
                if(!this.target.parallel)
                    data_state.active_pipelines.push(this.target);


            }else if(event_type=="ON_END"){

                if(!this.target.parallel){
                    var index=data_state.active_pipelines.indexOf(this.target);

                    data_state.active_pipelines.splice(index, 1);
                }
                this.target.active_parent.children.push(this.target);

                // display results
                // var root=create_node("root", create_data("root", {name:"root"}));
                // root.children=data_state.active_pipelines;
                 if(data_state.active_pipelines.length==0)
                render(data_state, div_id);

            }else{
                //data_state.active_pipelines.push(this.target);
            }
        }else{
            if(event_type=="ON_INIT"){
                this.target.pipeline.children.push(this.target);
            }else{
            }
        }
        callback(null, data_state);
    };
}

function timming_filter(data_state, callback){
               

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

               callback(null, data_state);

           }

    return {d3_debug_pipelines:debug_pipelines, timming:timming_filter};
});
