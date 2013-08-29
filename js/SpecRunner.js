require.config({
    baseUrl: "/js/",
    urlArgs: 'cb=' + Math.random(),
    paths: {
        jquery: 'jquery-1.10.2.min',
        jasmine: '../jasmine/lib/jasmine-1.3.1/jasmine',
        'jasmine-html': '../jasmine/lib/jasmine-1.3.1/jasmine-html'
//        spec: '../../pepe'
    },
    shim: {
        
        jasmine: {
            exports: 'jasmine'
        },
        'jasmine-html': {
            deps: ['jasmine'],
            exports: 'jasmine'
        }
    }
});

require(['jquery', 'jasmine-html'], function ($, jasmine) {

    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;

    var htmlReporter = new jasmine.HtmlReporter();

    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function (spec) {
        return htmlReporter.specFilter(spec);
    };

    var specs = [];

    specs.push('../spec/LoadingsSpec');



    $(function () {
        require(specs, function (spec) {
            jasmineEnv.execute();
        });
    });

});
