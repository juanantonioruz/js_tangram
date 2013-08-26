define(["js/pipelines/state_step_type.js", "js/pipelines/pipeline_type.js"],function(StateStep, Pipeline){
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

//it will  work as the beginning of the pipeline so it will let us work with .addTransformation method of the pipeline
// the state_step doesnt let this behavior
           function define_single_step_pipe(pipe_name, state_step_name_fn, bound){
               var the_name=pipe_name;
               if(!pipe_name){
                   the_name ="define_pipe_"+contador;
                   contador++;
               };

               return define_pipe({
                   arr:
                   [{item_name_fn:state_step_name_fn, bound:bound}],
                   spec:
                   {type:Pipeline, params:[the_name]}});
           }

           function define_state_step(state_step_name_fn, bound){
                              // if is not an  array then  is a state_step.. instanciate and return with {name and fn} properties oe element, the state step has is own name so we haven't to use the second argument named_pipe

                   //state_step
                   
                  var p=new StateStep(state_step_name_fn.name, state_step_name_fn.fn);

               if(bound)inject_values(p, bound);

                   return p;



           }

           //spec is an array // rename to define_
           function define_pipe(pipe_spec){

                   if( Object.prototype.toString.call( pipe_spec.arr ) !== '[object Array]' ) {

                       alert("donde vas calamer");
                       return null;
                   }else{
                   // else we create a pipeline with second parameter 

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
                   var x=conthunktor(pipe_spec.spec.type, pipe_spec.spec.params)();

                   ///----> recursive??? to make it adaptable to a tree data specification?
                   // foreach spec.arr we instanciate 
                   pipe_spec.arr.map(function(item){

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
           }

    return {pipeline:define_pipeline, single_step_pipe:define_single_step_pipe, state_step:define_state_step, pipe:define_pipe};
});
