define(["/js/Player.js"], function (Player) {
    return describe("Player", function() {
        var player=new Player();

          it("should be able to play a Song", function() {

              expect(player.name).toEqual("juan");
              
          });
        

    });


});
