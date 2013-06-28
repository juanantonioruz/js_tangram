define(function(){
    return function(){
        var result={
            // with a dot path obtain the asociated value in a tree structure
            get_value: function(path){

                if(path.indexOf(".")==-1){
                    
                    return result[path];
                } 

                var pos_arr=path.split(".");
                
                var search=result;
                for(var j=0; j<pos_arr.length; j++){
                    var pos_index=pos_arr[j];
                    if(pos_index.indexOf("]")!=-1){
                        var more_arr=pos_index.split("[");

                        for(var h=0; h<more_arr.length; h++){
                            var ee=more_arr[h].replace("]", "");
                            search=search[ee];

                        }
                    }else{
                        search=search[pos_index];
                    }
                    
                    
                    
                };
                return search;
            },
            ns:"root",

             history:[]
            , process_history:[]
            , for_each:[]
            ,children:[]
            , get_current_data_value:function(property_name){
                var r=result.get_current_data()[property_name];
                // for(var i=0; i<result.for_each.length; i++){
                //     var current_data=result.for_each[i];
                //     //console.log(current_data[property_name]);
                //     if(current_data[property_name]!==undefined){

                //         console.log("founded property_name:"+property_name+" in iteration index: "+i);


                //         return current_data[property_name];
                //     }  
                
                // }
                console.log("xxxx");
                console.dir(r);
                return r;
                // console.log("not founded property_name:"+property_name);
                // return null;
                
            },
            get_current_data:function(){
                return result.for_each[result.for_each.length-1];
            },
            set_next_current_data:function(next_current_data){
                var current_data=result.get_current_data();
                next_current_data._index_=current_data._index_+1;
                result.current_data=next_current_data;
                next_current_data.__proto__=current_data.__proto__;
                result.for_each[result.for_each.length-1]=next_current_data;
            },
            push_current_data:function(current_data){
                //TODO comment when updates  all references in transformations.js
                // USING PROTOTYPICAL INHERITANCE TO SOLVE CONTEXT
                current_data._index_=0;
                var n=current_data;
                if(result.get_current_data()){
                    n=Object.create(result.get_current_data());
                    // console.dir(result.get_current_data());
                    // console.dir(current_data);
                    n=$.extend( n, current_data);
//                    console.dir(n);
                    result.current_data=n;    


                }else{
                    result.current_data=n;
                }
                
                
                result.for_each.push(n);

            },
            pop_current_data:function(){
                result.current_data=result.for_each.pop();
            }
        };
        return result;
    };

});
