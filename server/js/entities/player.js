var Entity = require('./entity.js');
var Mainapp = require(require.main.filename);
var Player = function(id, side){
    var self = Entity();
    self.id = id;
    self.pressingUp = false;
    self.pressingDown = false;
    self.maxSpd = 10;
    self.style = side == "left" ? "red" : "blue";
    self.sizeLength = 140;
    self.sizeWidth = 25;
    self.number = "" + Math.floor(10 * Math.random());

    var super_update = self.update;
    self.update= function() {
        self.updateSpd();
        super_update();
    }

    self.updateSpd = function(){
        if(self.pressingUp)
            self.spdY = -self.maxSpd;
        else if (self.pressingDown)
            self.spdY = self.maxSpd;
        else
            self.spdY = 0;
    }

    self.getInitPack = function() {
        return {
            id:self.id,
            x:self.x,
            y:self.y,
            number:self.number
        };
    }

    self.getUpdatePack = function() {
        return {
            id:self.id,
            x:self.x,
            y:self.y,
            side:self.style
        };
    }

    Player.list[id] = self;

    var initPack = Mainapp.initPack;
    initPack.player.push(self.getInitPack());

    return self;
}

module.exports = Player;
