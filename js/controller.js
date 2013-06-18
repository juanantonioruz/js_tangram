require.config({
    urlArgs: "bust=" + (new Date()).getTime()
});

require(["js/start_ew.js", "js/start_proposal.js", "js/start_dev.js"],
        function(ew, proposal, dev) {

            function getURLParameter(name) {
                return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
            }
            if(getURLParameter("dev"))
                dev(); 
            else if (getURLParameter("proposal"))
                proposal();
            else if (getURLParameter("ew"))
                ew();


});
