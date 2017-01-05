var Ball = function(initPack) {
	var self = {};
	self.x = initPack.x;
	self.y = initPack.y;
	self.style = initPack.style;
	self.size = initPack.size;


	self.draw = function(ctx) {
        ctx.beginPath();
		ctx.fillStyle = self.style;
		ctx.arc(self.x, self.y, self.size, 0, Math.PI * 2);
		ctx.fill();
	}

	Ball.list[self.id] = self;
	return self;
}

module.exports = Ball;

