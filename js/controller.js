require.config({
    urlArgs: "bust=" + (new Date()).getTime()
});
var all=[];
require.onResourceLoad = function (context, map, depArray) {
    //console.log("prefix:"+map.prefix);    
    all.push(map.name);    
    //console.log("name:"+map.name);
};

this.init_debug=function(value){

    this.debug_value=value;

// require({
//     baseUrl: "/public/js/",
//     paths: {
//         order: "requirejs/plugins/order"
//     }
// });


};


this.init=function init(clean){
    console.log("this.debug_value: "+this.debug_value);
    console.log("------------------------------------INIT REQUIREJS !!!***");
    var stock;
    if(this.data_state){
        //        console.dir(this.data_state.password);
        stock=this.data_state;
    }
    if(all.length>0){
        end();
        if(stock){
            this.stock=stock;
        }
        //console.dir(this.data_state.password);
    }


    if(clean) ["left", "content", "right"].map(function(item){$('#'+item).empty();});



    require([ "js/start_proposal.js", "js/start_dev.js", "js/start_zendesk.js"],

            function( proposal, dev, zendesk) {
                function getURLParameter(name) {
                    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
                }
                // if(getURLParameter("dev"))
                //     dev(); 
                // else if (getURLParameter("proposal"))
                //     proposal();
                // // else if (getURLParameter("ew"))
                // //     ew();
                // else
                if(getURLParameter("proposal"))
                    proposal();
                else
                    zendesk();


            });
}
//console.log("pasando por controller");
init();

function end(){
    console.log("--------------------------- END requirejs:");
    all.map(function(item){

        require.undef(item);
    });
};
