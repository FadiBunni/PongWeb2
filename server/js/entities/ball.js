var Constants = require('../utils/server.constants.js');
var Entity = require('./entity.js');
var Mainapp = require(require.main.filename);
var Ball = function() {
	var self = Entity();
    self.id = Math.random();
	self.x = Constants.w/2;
	self.y = Constants.h/2;
	self.style = "white";
	self.size = 10;
	self.spdX = 5;
	self.spdY = 5;
	var w = Constants.w, h = Constants.h;

	var super_update = self.update;
    self.update= function() {
        //self.updatePosition();
        super_update();
    }

  //   self.updatePosition = function(){
  //       self.x += this.spdX;
		// self.y += this.spdY;
  //   }

    self.topCollision = function() {
    	if(this.y < 0){
			this.y = 0;
			this.vely *= -1;
		}

		if(this.y > h - this.size) {
			this.y = h - this.size;
			this.vely *= -1;
		}
    }

    self.sideCollision = function() {

    }

    self.getInitPack = function() {
        return {
            id:self.id,
            x:self.x,
            y:self.y,
            style:self.style,
            size:self.size,
        };
    }

    self.getUpdatePack = function() {
        return {
            id:self.id,
            x:self.x,
            y:self.y
        };
    }

    Ball.list[self.id] = self;

    var initPack = Mainapp.initPack;
    initPack.player.push(self.getInitPack());

    return self;
}

module.exports = Ball;