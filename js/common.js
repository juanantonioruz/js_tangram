define(["js/pipelines/state_step_type.js"],function(State_step){
    return {
        naming_fns:function(result, prefix){
            var new_map={};
            for (var key in result){
                
                var data={ name:((prefix)?prefix:"")+key, fn:result[key] };
                console.log(data.name);
                new_map[data.name]=new State_step(data.name, data.fn);
            }
            return new_map;
        },
        toJson: function toJson(o){
            return JSON.stringify(o, null, 4);
        },
         naming_pipes:function(result){
            for (var key in result){
                var inter_fn=result[key];
                inter_fn= inter_fn.bind({name:key});
                result[key]=inter_fn;
            }
             return result;

        },
        local_ip:"192.168.1.26"
};
});
