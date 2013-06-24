/* INCLUDE JQUERY */
var script = document.createElement('script');
script.src = 'http://code.jquery.com/jquery-1.9.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

setTimeout(function(){

    /* INCLUDE JQUERY-UI-BOOTSTRAP */
    $(document).ready(function(){
        $('head').append('<link rel="stylesheet" href="http://themes.demo.metalayer.com/static/css/jquery-ui-1.9.2.custom.css" type="text/css" />');
    });

}, 1000);
