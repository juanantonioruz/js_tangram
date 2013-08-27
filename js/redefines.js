define(function(){
           function inject_values(i, bound){
               for(var k in bound)
                   i[k]=bound[k];


           }
          
function define_pipe(pipe_spec){

                   if( Object.prototype.toString.call( pipe_spec.arr ) !== '[object Array]' ) {
                       console.dir(pipe_spec);
                       alert("this data is not logic: 'donde vas calamar!'");

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
//                       console.log(item.item_name_fn.name);
 //                      console.dir(item);
//                       console.dir(item);
                       if(item.item_name_fn.spec){ 
                           // if it is a pipeline specification
                           p=define_pipe(item.item_name_fn);
                           
                       }else
                       if(!item.item_name_fn.built){
 //                          console.dir(item);
                           p=new item.item_name_fn.type(item.item_name_fn.name, item.item_name_fn.fn);
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
  
  
    

    return {pipe:define_pipe};
});
