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



    function render(open_stack_tree_display_data,data_state,  on_success_callback){

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
            .on("click", function(d,i){
                var that=this;
                

                
                var selection=d3.select(this);
                show_message_to_the_user(d.data_displayed.type);
                  on_success_callback();
                selection.transition().duration(500).style("fill", "blue").attr("r", radio_max);
            })
            .on("mouseout", function(d,i){
                var that=this;

                var selection= d3.select(this);
                if(selection.attr("r")>100){
                    d3.select(this).transition().duration(500).style("fill", "black").attr("r", radio);
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
