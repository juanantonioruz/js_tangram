define(["js/common.js"],
       function(common) {
           var result={};
           //uniques
           result.id={};
           result.human_id={};
           // not uniques
           result.human={};
           result.url={};
           result.created={};
           result.updated={};
           result.time_zone={};

           Object.keys(result).map(function(item){
               result[item].key=item;
           });

           return result;
});
