define(["js/pipelines/state_step_type.js","js/meta_model/info_type.js","js/meta_model/data_type.js"],function(State_step, i_type, d_type){
    var r= {
        define_data:function (info_type_key, data_type_key){
               return {info_type:i_type[info_type_key].key, data_type:d_type[data_type_key].key};
           },
        analyse_data: function (schema){
               var the_data_analysed={human:[]};
               console.dir(schema);
               Object.keys(schema).map(function(item){
               schema[item].key=item;
                   if(schema[item] && schema[item].toString()=="[object Object]"){
                       var info_type=schema[item].info_type;
                       if(info_type==i_type.id.key)
                           the_data_analysed.id=item;

                       if(info_type==i_type.human_id.key)
                           the_data_analysed.human_id=item;


                       if(info_type==i_type.human.key)
                           the_data_analysed.human.push({key:item, type:schema[item].data_type});




                   }

               });
               console.dir(the_data_analysed);

               return the_data_analysed;
           },
        naming_fns:function(result, prefix){
            var new_map={};
            for (var key in result){
                var data={ name:((prefix)?prefix:"")+key, fn:result[key] };
                //                console.log(data.name);
//                new_map[data.name]=new State_step(data.name, data.fn);
                new_map[data.name]={name:data.name,fn:data.fn, type:State_step};
            }
            return new_map;
        },
        renaming_fns:function(result, prefix){
            var new_map={};
            for (var key in result){
                var data={ name:((prefix)?prefix:"")+key, fn:result[key] };
                //                console.log(data.name);
//                new_map[data.name]=new State_step(data.name, data.fn);
                new_map[key]={name:data.name,fn:data.fn, type:State_step};
            }
            return new_map;
        },
        toJson: function toJson(o){
            return JSON.stringify(o, null, 4);
        },
        naming_pipes:function(result, prefix){
            for (var key in result){
                var inter_spec=result[key];
                var the_name=((prefix)?prefix:""+key);
//                inter_fn= inter_fn.bind({name:((prefix)?prefix:"")+key});
                if(inter_spec.spec)
                    if(inter_spec.spec.params){
                        inter_spec.spec.params.unshift(the_name);
                    };
                result[((prefix)?prefix:"")+key]={name:the_name, spec:inter_spec};
            }
            return result;

        },
        local_ip:"192.168.1.26",
        remote_ip:"85.136.107.32",

        
        // d3 related functions

        //__data:{type:"", data:{item:{name:"", id:""}, href:""}, }
        create_node:function(the_name, __data){

            var _data=__data.data;
//            r.common
            var que={name:the_name,ns:the_name, children:[], type:__data.type, item_name:_data.item ? _data.item.name : "" , item_id:_data.item ? _data.item.id : "", item_href:__data.href};


            return que;
        }


        , 
        // data:{item.name, item.id, href}
        create_data:function(_type, _data){
            return {type:_type, data:_data};
        },
        logging:{
            dao:{
                dir:true
            },
            dispatcher:{
                searching:false,
                listeners:true,
                listeners_detail:true
            }
            
        }

    };
    return r;
});
