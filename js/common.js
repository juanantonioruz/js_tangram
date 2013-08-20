define(["js/pipelines/state_step_type.js"],function(State_step){
    return {
        naming_fns:function(result, prefix){
            var new_map={};
            for (var key in result){
                var data={ name:((prefix)?prefix:"")+key, fn:result[key] };
//                console.log(data.name);
                new_map[data.name]=new State_step(data.name, data.fn);
            }
            return new_map;
        },
        toJson: function toJson(o){
            return JSON.stringify(o, null, 4);
        },
        naming_pipes:function(result, prefix){
            for (var key in result){
                var inter_fn=result[key];
                inter_fn= inter_fn.bind({name:((prefix)?prefix:"")+key});
                result[key]=inter_fn;
            }
            return result;

        },
        local_ip:"192.168.1.26",
        remote_ip:"85.136.107.32"
            // d3 related functions
, create_node:function(the_name, _data){
    return {name:the_name,ns:the_name, children:[], data_displayed:_data};
}

, create_data:function(_type, _data){
    return {type:_type, data:_data};
},
        logging:{
            dao:{
                dir:false
            },
            dispatcher:{
                searching:false,
                listeners:true,
                listeners_detail:true
            }
            
        }

    };
});
