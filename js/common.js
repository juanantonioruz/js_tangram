define(function(){
    return {
        naming_fns:function(result, prefix){
            var new_map={};
            for (var key in result){
                new_map[key]={ name:((prefix)?prefix:"")+key, fn:result[key] };
            }

            return new_map;

        },
        toJson: function toJson(o){
            return JSON.stringify(o, null, 4);
        }
};
});
