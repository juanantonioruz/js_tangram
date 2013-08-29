define(["js/common.js"],
       function(common) {
           var result={};
           result.string={};
           result.numeric={};
           result.url={};
           result.email={};
           result.date={};
           Object.keys(result).map(function(item){
               result[item].key=item;
           });

           return result;
});
