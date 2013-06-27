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
            ns:"root"
            , history:[]
            , process_history:[]
            , for_each:[]
            ,children:[]
        };
        return result;
    };

});
