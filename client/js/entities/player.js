var Player = function(initPack) {
	var self = {};
	self.id = initPack.id;
	self.number = initPack.number;
	self.x = initPack.x;
	self.y = initPack.y;
	self.sizeLength = initPack.sizeLength;
	self.sizeWidth = initPack.sizeWidth;
	self.style = initPack.style;


	self.draw = function(ctx) {
		ctx.fillStyle = self.style;
        ctx.fillRect(self.x, self.y, self.sizeWidth, self.sizeLength);
	}

	Player.list[self.id] = self;
	return self;
}

module.exports = Player;