define(["js/pipelines/state_step_type.js", "js/pipelines/pipeline_type.js","js/pipelines/switcher_pipeline_type.js","js/pipelines/mapper_pipeline_type.js"],function(StateStep, Pipeline, SwitcherPipeline, MapperPipeline){
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
    // simplified version with no bound option!! TODO 


           function define_pipeline(data){
               console.log("add bound option y update common.namingPipelines!!");
               var array_adapted=[];
               //item_name_fn is the standard in common.js naming_functions
               data.array_state_step_functions.map(function(item_name_fn){
                   item_name_fn.type=StateStep;
                   array_adapted.push({item_name_fn:item_name_fn,type:item_name_fn.type});
               });
               var spec=createSpec();
               
               spec. arr=array_adapted;
               spec.spec= {type:Pipeline, params:[data.name]};
               return spec;
           };

function _createTransformation(state_step_name_fn, bound){
    var x= {item_name_fn:state_step_name_fn, bound:bound, type:state_step_name_fn.type};
    return x;
}
    function createSpec(){
        var s={};
        s.addTransformation=function(state_step_name_fn, bound){
            if(state_step_name_fn.spec) return s._addPipe(state_step_name_fn, bound);
            state_step_name_fn.type=StateStep;
            var x= {item_name_fn:state_step_name_fn, bound:bound, type:state_step_name_fn.type};
            s.arr.push(x);
            return s;
        };
        s._addPipe=function(x){
            var t={item_name_fn:x};
            s.arr.push(t);
            return s;
        };
        
        return s;
    }

//it will  work as the beginning of the pipeline so it will let us work with .addTransformation method of the pipeline
// the state_step doesnt let this behavior
           function define_single_step_pipe(pipe_name, state_step_name_fn, bound){
               var the_name=pipe_name;
               if(!pipe_name){
                   the_name ="define_pipe_"+contador;
                   contador++;
               };
               var s=createSpec();

                   s.arr=
                   [{item_name_fn:state_step_name_fn, bound:bound, type:state_step_name_fn.type}];
                   s.spec=
                   {type:Pipeline, params:[the_name]};
               

               return s;
           }


           //spec is an array // rename to define_
           function define_pipe(){alert("the place has changed!");}

    function define_switch(key_model, on_true, on_false, fn_exp){              
        return {
                   arr:  [], 
                   spec: {
                       type:SwitcherPipeline, 
                       params:[
                           "switch", 
                           function(value){
                               var  r_fn=fn_exp? fn_exp(value): value;
                               if(r_fn) {
                                   return on_true;
                               }else{
                                   return on_false;
                               }
                           }, 
                           key_model
                       ]}};

    }

 function define_mapper(key_model, map){              
        return {
                   arr:  [], 
                   spec: {
                       type:MapperPipeline, 
                       params:[
                           map, key_model

                       ]}};

    }


    return {pipeline:define_pipeline, single_step_pipe:define_single_step_pipe,mapper:define_mapper,  switcher:define_switch, _createTransformation:_createTransformation};
});
