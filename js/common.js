define(function(){
    return {toJson: function toJson(o){
        return JSON.stringify(o, null, 4);
    }};
});
