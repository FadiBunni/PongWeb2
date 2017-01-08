var Constants = require('../utils/server.constants.js');
var Entity = require('./entity.js');
var Mainapp = require(require.main.filename);
var Ball = function(players) {
	var self = Entity();
    self.id = Math.random();
	self.x = Constants.w/2;
	self.y = Constants.h/2;
	self.style = "white";
	self.size = 10;
	self.spdX = ranInt(0,1) == 0 ? -3 : 3;
	self.spdY = ranInt(0,1) == 0 ? -3 : 3;
    self.players = players;

	var w = Constants.w, h = Constants.h;

	var super_update = self.update;
    self.update= function() {
        self.updatePosition();
        super_update();
        self.TBCollision();
        self.paddleCollision();
    }

    self.updatePosition = function(){
        self.x += self.spdX;
        self.y += self.spdY;
    }

    self.TBCollision = function() {
    	if(self.y < 0){
			self.y = 0;
			self.spdY *= -1;
		}else if(self.y > h - self.size) {
            self.y = h - self.size;
            self.spdY *= -1;
        }
    }

    self.LRCollision = function() {

    }

    self.paddleCollision = function() {
        for(var i in players){
            var p = players[i]
            if(self.x > p.x && self.x < p.x + p.sizeWidth){
                if(self.y > p.y && self.y < p.y + p.sizeLength) {
                    self.spdX *= -1;
                }
            }
        }
    }

    self.getInitPack = function() {
        return {
            id:self.id,
            x:self.x,
            y:self.y,
            style:self.style,
            size:self.size
        };
    }

    self.getUpdatePack = function() {
        return {
            id:self.id,
            x:self.x,
            y:self.y
        };
    }

    function ranInt(Min, Max) {
        return Math.floor(Math.random() * (Max-Min+1) + Min);
    }

    Ball.list[self.id] = self;

    var initPack = Mainapp.initPack;
    initPack.ball.push(self.getInitPack());
    return self;
}

module.exports = Ball;