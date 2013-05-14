require.config({
    urlArgs: "bust=" + (new Date()).getTime()
});

require(["js/behaviors/chains_manager.js"],
        function(chains) {

  chains.start_bis();
        });
