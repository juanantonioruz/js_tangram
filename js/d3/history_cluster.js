define(["js/common.js"], function(common) {

    
    var
    radio=5,
    radio_max=150,
    width = 1900,
    height = 150;
    var contador;
    var space_item=40;

    var folder;
    
    function contains(c, s){
        return  (c.indexOf(s)!=-1);
    }

    function is_event(d){
        return contains(d.item.ns, "EVENT");
    };
    function is_mapper(d){
        return contains(d.item.ns, "?");
    };
    function is_model(d){
        return contains(d.item.ns, "$");
    };
    function colorize(d){
        if(is_event(d))
            return "red";
        else if(is_mapper(d))
            return "green";
        else if(is_model(d))
            return "violet";

        else
            return "#484848";
    }

    var diagonal = d3.svg.diagonal()
            .projection(function(d) { return [d.y, d.x]; });

    function _create_node(item, path){
        return {ns:item.ns,item:item, children:[], path:path, relation:item.relation};
    };


// function to filter the visualization... secondary 
    function check_path(colector,  container, path_array){

        var is_in_path=false;
        if(colector.ns=="root") is_in_path=true;
        // console.log(colector.ns+"........"+container.path+":::::"+path_array);
        // only check if is pipeline
        if( path_array && path_array.length>0){
            is_in_path=false;
            for(var j=0; j<path_array.length; j++){
                var path=path_array[j];
                var path_compared=container.path;
                //                console.log("** "+path+"=="+path_compared);
                if(path.toLowerCase().indexOf(path_compared)!=-1){
                    is_in_path=true;
                    break;
                }
            }
        }else{
            //        console.log(container.ns);
            is_in_path=true;            
        }
        return is_in_path;
    }

    function recursive(colector, container, path_array){
        if(colector.children && check_path(colector, container, path_array)){
            for(var i=0; i<colector.children.length; i++){
                var child=colector.children[i];
                
                var int_path=(container.path+"/"+colector.ns).replace("pipeline_", "").replace("state_step_", "").toLowerCase();
                var element=_create_node(child, int_path);

                
                if(check_path(child, element, path_array)){
                    if(container.children.indexOf(element)==-1)
                    container.children.push(element);
                    
                    if(!child.closed ){
                        recursive(child, element, path_array);
                    }else{
                        contador++;
                    }
                }
            }
        }else{
            contador++;
        }
    };

    function insert_in_root_and_continue(new_root, the_ns, relationship, colector ){
        contador++;
        var  x={ns:the_ns, relation:relationship, parent:new_root, children:[]};

        new_root.children.push(x);

        if(colector.children)
            colector.children.map(function(item){
                determine_recursive(item ,x);
            });

}

    function clean_ns(item){
        return item.ns.replace("pipeline_", "").replace("state_step_", "").toUpperCase();
    }

    function determine_recursive(item,  new_root){
        var nested_item;
 //       console.log("]]]][[[[[[[[[[[[[[ RESTO: "+item.ns);
        //                alert("third"+colector.ns);
        var  the_ns=clean_ns(item);
        
        if(the_ns.indexOf("*EVENT*")!=-1){
            if(the_ns.indexOf("ON_INIT")!=-1)            
                insert_in_root_and_continue(new_root, clean_ns(item.children[0]), "ON_INIT", item.children[0]);
            else if(the_ns.indexOf("ON_END")!=-1)            
                insert_in_root_and_continue(new_root.children[new_root.children.length-1], clean_ns(item.children[0]), "ON_END", item.children[0]);
            else 
                insert_in_root_and_continue(new_root, the_ns.replace("*EVENT*", ""), "ON_USER", item);
        }else if(the_ns.indexOf("*SWITCH*")!=-1){
            insert_in_root_and_continue(new_root, the_ns.replace("_?", " = ").replace("*SWITCH*", ""), "SWITCH", item);            
        }else if(the_ns.indexOf("*MAPPER*")!=-1){
            
            insert_in_root_and_continue(new_root, the_ns.replace("_?", " = ").replace("*MAPPER*", ""), "MAPPER", item);            
        }else{
            insert_in_root_and_continue(new_root, the_ns, "CHILD", item);
        }
        

    }

    function determine_relation_childs(root){
        
        //TODO :: recursive function and return new data hierarchical collection
        var new_root={ns:root.ns, children:[], relation:"ROOT", parent:null};

        root.children.map(function(item){
            determine_recursive(item,  new_root);
        });
      //  console.dir(new_root);
        return new_root;
        
    };

    function render(root,window_id_ref,  div_id, item_fn, path_array){
        if(arguments.length!=5) alert("you have to adapt to the changes of this function arguments.. in history_cluster.js/render"+arguments.length);


        var div_container=$(window_id_ref.document).find(div_id);

        console.log("RENDERING VISUALIZATION!!");

        contador=2;

        root=determine_relation_childs(root);

        var int_root=_create_node(root, "");

        recursive(root, int_root, path_array);
        
        //     console.dir(int_root);

        div_container.empty();
        div_container.hide();
        var svg = d3.select(window_id_ref.document).select(div_id).append("svg")
                .attr("width", width)
                .attr("height", contador*space_item)
                .append("g")
                .attr("transform", "translate(40,0)");
        var cluster = d3.layout.cluster()
                .size([contador*space_item, width - 160]);

        var nodes = cluster.nodes(int_root),
            links = cluster.links(nodes);

        var link = svg.selectAll(".link")
                .data(links)
                .enter().append("path")
                .attr("class", function(d){
                    // console.info(d.source.ns);
                    // console.dir(d);                   
                    if( d.target && d.target.relation=="ON_END" ){
//                         console.dir(d);                   
                        return "link_on_end";
                    }else if( d.target && d.target.relation=="ON_INIT" ){
//                         console.dir(d);                   
                        return "link_on_init";
                    }else if( d.target && d.target.relation=="ON_USER" ){
//                         console.dir(d);                   
                        return "link_on_user";
                    }else if( d.target && d.target.relation=="SWITCH" ){
//                         console.dir(d);                   
                        return "link_switch";
                    }else if( d.target &&  d.target.relation=="MAPPER" ){
//                         console.dir(d);                   
                        return "link_mapper";


                    }else{ 

                        return "link";
                    }
                
                     })
                .attr("d", diagonal);



        var node = svg.selectAll(".node")
                .data(nodes)
                .enter().append("g")
                .attr("class", "node")
        
                .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

        // pipelines and root
        node.append("rect")
            .attr("y",-2) 

            .attr("display",function(d){
                if(!d.item.children.length>0){

                    return "visible";}else{ return "none";}})
            .attr("width", 200)
            .attr("height", 8)
            .attr("fill",function(d,i){
                if(contains(d.ns, "DAO")) 
                    return "fuchsia";
                else if(contains(d.ns, "MODEL_STORE"))
                    return "crimson";
                else if(contains(d.ns, "UI"))
                    return "mediumspringgreen";
                else if(contains(d.ns, "QUERY"))
                    return "olive";
                else if(contains(d.ns, "D3"))
                    return "orange";
                else if(contains(d.ns, "template"))
                    return "yellow";
                else if(contains(d.ns, "modals"))
                    return "#999999";
                else if(contains(d.ns, "relationships"))
                    return "Moccasin";

                else
                    return "#e5e5e5";

            })
            .on(item_fn.mouse_event_name, function(d,i){
                var context_call={path_array:path_array, d:d};
                item_fn.fn.bind(context_call).call();
                if(context_call.rerender)
                    render(root, window_id_ref, div_id, item_fn, path_array);
                // not necesary but this works if(d3.select(this).attr("display"))

            })
        ;

        node.append("rect")
            .attr("display",function(d){ if(d.item.children.length>0) return "visible"; return "none";})
        .attr("y", -10)
            .attr("width", function(d,i){
                if(d.item.folder) return radio*7;
                return radio*3;
            })
            .attr("height", 20)
            .attr("id", function(d,i){

                if(d.item.folder){
                    return "folder";
                }
                return d.ns;

            })
            .attr("fill","#CCC")
            .on("mouseover", function(d,i){
                var actual=d3.select(this);
                console.log(d.path);
                actual.transition().style("fill", "RoyalBlue").each("end", function(){actual.transition().delay(500).style("fill", colorize(d));});
                if(!d.item.closed){
                    var ele=d3.select(this.parentNode).select(":last-child");

                    var p=ele.transition().style("fill", "RoyalBlue").each("end", function(){ele.transition().delay(500).style("fill", colorize(d));});
                }
                //console.dir(ele);
                // not necesary but this works if(d3.select(this).attr("display"))

            })
            .on("click", function(d,i){
                console.log("deactived onclick closed");
                d.item.closed=!d.item.closed;

                if(!d.item.closed)
                    d.item.folder=true;
                else
                    d.item.folder=false;
                // not necesary but this works if(d3.select(this).attr("display"))
                render(root, window_id_ref, div_id, item_fn, path_array);
            })
            .on(item_fn.mouse_event_name, function(d,i){
                var context_call={path_array:path_array, d:d};
                item_fn.fn.bind(context_call).call();
                if(context_call.rerender)
                    render(root, window_id_ref, div_id, item_fn, path_array);
                // not necesary but this works if(d3.select(this).attr("display"))

            })

        ;

        function is_visible(d){
            return !d.item.children.length>0 || d.item.closed;
        }

        node.append("text")

            .attr("dx", function(d) { var length=d.ns.replace("pipeline_", "").replace("state_step_", "").length*2; 
                                      return d.item.children.length>0 ? length : -50; })
            .attr("dy",function(d) { return d.item.children.length>0 ? -13 : -8; }) 
            .style("fill", function(d){
                if(is_visible(d)){
                    if(d.item.children.length>0) {
                        return "RoyalBlue";
                    }else{
                        return colorize(d);
                    }
                }else{ 
                    return colorize(d);}} )
            .style("font-size", "12px")
            .style("text-anchor", function(d) { return d.children.length>0 ? "end" : "start"; })
            .text(function(d) { 
                var upper=false;
                if(d.ns.indexOf("pipeline_")!=-1)
                    upper=true;
                var res=d.ns.replace("pipeline_", "").replace("state_step_", "");
                var path_m=d.path.toLowerCase();
                if(d.ns.indexOf("pipeline_")!=-1){
                    path_m+="/"+res.toLowerCase();
                    if(path_array && path_array.indexOf(path_m)!=-1)
                        res+="(*)";
                }

                if(upper) res=res.toUpperCase();


                return res; 
            }
                 );

        d3.select(self.frameElement).style("height", contador*space_item + "px");        

        
        $(window_id_ref.document).find(div_id).fadeIn(100, function(){
            var selection=d3.select("#folder");
            if(!selection.empty()){

                selection.transition().delay(1500).style("fill", function(d,i){
                    d.item.folder=false;
                    return "#333";
                }).attr("width", radio*3).attr("height", radio*3);

            }
            
            $(window_id_ref).scrollTop($(window_id_ref.document).height());
        });
        

        


    };




    return render;

});
