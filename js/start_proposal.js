require.config({
    urlArgs: "bust=" + (new Date()).getTime()
});

function clean_left_status_messages(){
    $('.left_message').remove();
}

function clean_history(){
    $('#history_status').append("<hr>");

}


define(["js/common.js", "js/open_stack/events.js", "js/open_stack/filters.js", "js/pipelines/dispatcher.js", "js/pipelines/state_type.js", "js/open_stack/pipelines.js", "js/open_stack/d3_visualizations.js"
        ,"js/pipelines/pipeline_type.js","js/pipelines/switcher_pipeline_type.js","js/pipelines/state_step_type.js", "js/d3/history_cluster.js", "js/open_stack/model/tenant.js", "js/open_stack/model/token.js" ,"js/open_stack/ui.js"],
       function(common, events, filters,  dispatcher,  State, os_pipelines, d3_pipes,  Pipeline, SwitcherPipeline, StateStep, history_cluster,tenant_model, token_model, ui) {


           function inject_values(i, bound){
               for(var k in bound)
                   i[k]=bound[k];


           }
           var contador=0;
           // use    result[((prefix)?prefix:"")+key]={name:the_name, spec:inter_spec};
           // define_pipeline_single(os_pipelines.load_tokens);
           // function define_pipeline_single(data){
           //     return define_pipeline({arr:[data.fn], name:data.name});
           // }

           //data= {array_state_step_functions, name }
           function define_pipeline(data){
               var array_adapted=[];
               //item_name_fn is the standard in common.js naming_functions
               data.array_state_step_functions.map(function(item_name_fn){array_adapted.push({item_name_fn:item_name_fn});});

               var spec={ arr:array_adapted,
                          spec:
                          {type:Pipeline, params:[data.name]}};
               return define_pipe(spec, data.name);
           };

           function define_single_step_pipe(state_step_name_fn){
               
           }

           //spec is an array // rename to define_
           function define_pipe(spec, named_pipe){

                   if( Object.prototype.toString.call( spec ) !== '[object Array]' ) {


               // if is not an  array then  is a state_step.. instanciate and return with {name and fn} properties oe element, the state step has is own name so we haven't to use the second argument named_pipe

                   //state_step
                   //                   var np=new Pipeline("me"+contador);


                   
                  var p=new StateStep(spec.name, spec.fn);
                   if(it.bound)inject_values(p, item.bound);
                   //                  np.addTransformation(p);
                   return p;

               }else{
                   // else we create a pipeline with second parameter 
                   var the_name=named_pipe;
                   if(!named_pipe){
                       the_name ="define_pipe_"+contador;
                       contador++;
                   };

                   // this function taken from http://stackoverflow.com/questions/3362471/how-can-i-call-a-javascript-constructor-using-call-or-apply
                   function conthunktor(Constructor, args) {
                       return function() {

                           var Temp = function(){}, // temporary constructor
                               inst, ret; // other vars

                           // Give the Temp constructor the Constructor's prototype
                           Temp.prototype = Constructor.prototype;

                           // Create a new instance
                           inst = new Temp;

                           // Call the original Constructor with the temp
                           // instance as its context (i.e. its 'this' value)
                           ret = Constructor.apply(inst, args);

                           // If an object has been returned then return it otherwise
                           // return the original instance.
                           // (consistent with behaviour of the new operator)

                           return Object(ret) === ret ? ret : inst;

                       };
                   }

                   //  instanciate the pipeline with spec.spec object type and params properties
                   var x=conthunktor(spec.spec.type, spec.spec.params)();

                   ///----> recursive??? to make it adaptable to a tree data specification?
                   // foreach spec.arr we instanciate 
                   spec.arr.map(function(item){

                       // check if the item_name_fn is already instanciate <-- that's related with the data one level item_name_fn nature
                       // so we check if it is built and in this case the object will be a state_step or a pipeline
                       var p;
                       if(!item.item_name_fn.built){
                           
                           p=new StateStep(item.item_name_fn.name, item.item_name_fn.fn);
                       }else{
                           
                           p=item.item_name_fn;
                       }
                       if(item.bound)inject_values(p, item.bound);
                       x.addTransformation(p);
                   });
                   x.built=true;
                   return x;
                   // require a new pipe
               }
           };


           var data_state=State();

           data_state.host=document.location.host;

           var load_operation=os_pipelines.load_operation;
           os_pipelines=os_pipelines.pipes;

           var result=function(){
               // EOP
               dispatcher.reset();

               //ON LOAD APP show register_form
//{array_state_step_functions:[], name }
               dispatcher.listen_event(events.on_load_app, 
                                       define_pipe(ui.ui_register_form));



               // var load_tenants= define_pipe(os_pipelines.load_tenants.spec, os_pipelines.load_tenants.name);

               // var ok_register=define_pipe({arr:
               //                              [
               //                                  {item_name_fn:ui.ui_empty_register_form},
               //                                  {item_name_fn:load_tenants},
               //                                  {item_name_fn:ui.ui_select_tenants}
                                                
               //                              ], 
               //                              spec:{type:Pipeline, params:["reg_ok"]}}, "register_ok");
               // var evaluation=define_pipe({
               //     arr:  [], 
               //     spec: {
               //         type:SwitcherPipeline, 
               //         params:[
               //             "switch", 
               //             function(value){
               //                 if(value) 
               //                     return ok_register;
               //                 else
               //                     return define_pipe(
               //                         [
               //                             {item_name_fn:ui.ui_alerta, boud:{show:"juan", juan:"work"}}
               //                         ]);
               //             }, token_model.data_state_key
               //         ]}},
               //                            "switch");



               // dispatcher.listen_event(events.try_to_log, 
               //                         define_pipe(os_pipelines.load_tokens.spec, os_pipelines.load_tokens.name)
               //                         .addTransformation(evaluation)
               //                         ,false);


               // dispatcher.listen_event(events.tenant_selected, 
               //                         define_pipe(os_pipelines.load_tenant_selected.spec, os_pipelines.load_tenant_selected.name)
               //                         .addTransformation(define_pipe(
               //                             [
               //                                 {item_name_fn:ui.ui_select_operations, boud:{show:"juan", juan:"work"}}
               //                             ]))
//                                       ,false);

               /*


                dispatcher.listen_event(events.operation_selected, os_pipelines.operation_selected, false);

                dispatcher.listen_event(events.send_create_server, os_pipelines.send_create_server, false);

                dispatcher.listen_event(events.send_create_network, os_pipelines.create_network, false);

                dispatcher.listen_event(events.send_create_subnet, os_pipelines.create_subnet, false);
                


                //example on_init and on_load listening events
                dispatcher.listen_pipe(events.on_init,"load_tokens", os_pipelines.alerta, false);
                dispatcher.listen_pipe(events.on_end,"load_tokens", os_pipelines.alerta, false);


                //D3 openStack client UI
                dispatcher.listen_state_step(events.on_end,"model_store_tenants", d3_pipes.d3_show_tenants,true);   
                
                dispatcher.listen_pipe(events.on_end,"listing_servers", d3_pipes.d3_show_servers,true);   
                
                dispatcher.listen_pipe(events.on_end,"tenant_selected", function(){ 
                return new Pipeline("d3_update")
                .addPipe(load_operation("list","servers"))
                .addPipe(load_operation("list","images"))
                .addPipe(load_operation("list","flavors"))
                .addPipe(load_operation("list","networks"))
                .addTransformation(d3_pipes.d3_show_tenants)
                .addTransformation(d3_pipes.d3_show_servers)
                .addTransformation(d3_pipes.d3_show_images)
                .addTransformation(d3_pipes.d3_show_flavors)
                .addTransformation(d3_pipes.d3_show_networks)
                .addTransformation(os_pipelines.alerta)
                ;
                },true);   

                dispatcher.listen_pipe(events.on_end,"send_create_server", function(){ 
                return new Pipeline("d3_create_server")
                .addTransformation(d3_pipes.d3_show_tenants)
                .addPipe(load_operation("list","servers"))
                .addTransformation(d3_pipes.d3_show_servers)

                ;
                },true);   

                dispatcher.listen_pipe(events.on_end,"create_subnet", function(){ 
                return new Pipeline("d3_create_subnet")
                .addTransformation(d3_pipes.d3_show_tenants)
                .addTransformation(d3_pipes.d3_show_networks)

                ;
                },true);   

                */


               // Filtering all transformations ::: AOP 
               dispatcher.reset_filters();
               //               dispatcher.filter( filters.logging(true));
               
               // dispatcher.filter( filters.clone_data);

               // dispatcher.filter( filters.profiling);

               // dispatcher.filter( filters.show_profiling);

               dispatcher.filter(filters.d3_debug_pipelines(history_cluster, childWin, "#pipelines",
                                                            {"mouse_event_name":"contextmenu", fn:function(){
                                                                console.log("NS: "+this.d.ns);
                                                                console.log("PATH: "+this.d.path);
                                                                if(this.d.ns.indexOf("pipeline_")!=-1){
                                                                    this.d.path+="/"+this.d.ns.replace("pipeline_", "").toLowerCase();
                                                                    // alert(this.d.path);
                                                                }
                                                                if(this.path_array)                                            
                                                                    if(this.path_array.indexOf(this.d.path)==-1){
                                                                        
                                                                        this.path_array.push(this.d.path);
                                                                    }else{
                                                                        this.path_array=this.path_array.splice(this.path_array.indexOf(this.d.path),1);
                                                                    }
                                                                //console.log(this.path_array);
                                                                this.rerender=true;
                                                                d3.event.preventDefault();

                                                            }}));


               dispatcher.dispatch(events.on_load_app, new Pipeline("start"), data_state);

           };

           
           return result;

       });
