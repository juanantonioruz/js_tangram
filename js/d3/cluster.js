define( function() {

    
    var
    radio=4.5,
    radio_max=150,
    width = 960,
    height = 300;

    var cluster = d3.layout.cluster()
            .size([height, width - 160]);

    var diagonal = d3.svg.diagonal()
            .projection(function(d) { return [d.y, d.x]; });



    function render(open_stack_tree_display_data,data_state, target, dispatcher,  on_success_callback){

        $('#chart').empty();
        $('#chart').hide();
        var svg = d3.select("#chart").append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(40,0)");

        var nodes = cluster.nodes(open_stack_tree_display_data),
            links = cluster.links(nodes);

        var link = svg.selectAll(".link")
                .data(links)
                .enter().append("path")
                .attr("class", "link")
                .attr("d", diagonal);

        var node = svg.selectAll(".node")
                .data(nodes)
                .enter().append("g")
                .attr("class", "node")
                
                .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

        
        node.append("circle")
            .attr("r", radio)

            .attr("opacity", function(d){return (d.data_displayed.type!="folder")?100:0;})
            .attr("fill", function(d){return (d.selected)?"red":"blue";})
            .on("click", function(d,i){

                
                var selection=d3.select(this);
                show_message_to_the_user(d.data_displayed.type);
                d.selected = !d.selected;

//                console.dir(d);
                 if(d.data_displayed.type=="tenant"){
                     data_state.tenant_name=d.data_displayed.data.item.name;
                     data_state.tenant_id=d.data_displayed.data.item.id;

                     dispatcher.dispatch("tenant_selected", target, data_state,  function(res,pipeline){console.log("tenant_selected!");} );
}
                if(d.selected)
                data_state[d.data_displayed.type+"_selected"]=d.data_displayed.data.href;
                var color=(d.selected)?"red":"blue";
                selection.transition().duration(500).style("fill", color).attr("r", radio_max);
               // this works if we translate the decisions to the d3 interface  on_success_callback();
            })
            .on("mouseout", function(d,i){

                var color=(d.selected)?"red":"blue";

                var selection= d3.select(this);
                if(selection.attr("r")>100){
                    d3.select(this).transition().duration(500).style("fill", color).attr("r", radio) ;
                }
            })
        ;

        node.append("text")
            .attr("dx", function(d) { return d.children ? -8 : 8; })
            .attr("dy", 3)
            .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
            .text(function(d) { return d.name; });
        d3.select(self.frameElement).style("height", height + "px");        
        $('#chart').fadeIn(1000, function(){

               
        });
      


    };




    return render;

});
