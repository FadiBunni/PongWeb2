(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Ball = function(initPack) {
	var self = {};
	self.id = initPack.id;
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


},{}],2:[function(require,module,exports){
var Player = function(initPack) {
	var self = {};
	self.id = initPack.id;
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
},{}],3:[function(require,module,exports){
//initializing "classes"
var cUtils = require('./utils/utils.canvas.js');
var Keys = require('./utils/utils.keys.js');
var Constants = require('./utils/client.constants.js');
var Player = require('./entities/player.js');
var Ball = require('./entities/ball.js');

// Setting up canvas
var w = Constants.w, h = Constants.h;
var canvas = cUtils.generateCanvas(w, h);
var ctx = canvas.getContext('2d');
var serverFull = document.getElementById('full');

//socket connection, and exporting for other files.
var socket = io();

Player.list = {};
Ball.list = {};

//communication with the server:
socket.on('init', function(data){
    for(var i = 0; i < data.player.length; i++){
        new Player(data.player[i]);
    }
    console.log(data.player);
    for(var i = 0; i < data.ball.length; i++){
        new Ball(data.ball[i]);
    }
});

socket.on('update', function(data){
    for(var i = 0; i< data.player.length; i++){
        var pack = data.player[i];
        var p = Player.list[pack.id];
        if(p){
            // do I need x?
            if(pack.x !== undefined)
                p.x = pack.x;
            if(pack.y !== undefined)
                p.y = pack.y;
        }
    }

    for(var i = 0; i< data.ball.length; i++){
        var pack = data.ball[i];
        var b = Ball.list[pack.id];
        if(b){
            if(pack.x !== undefined)
                b.x = pack.x;
            if(pack.y !== undefined)
                b.y = pack.y;
        }
    }
});

socket.on('remove', function(data){
    for(var i = 0; i < data.player.length; i++)
        delete Player.list[data.player[i]];
    for(var i = 0; i < data.ball.length; i++)
        delete Ball.list[data.ball[i]];
});

socket.on('serverIsFull', function(data){
    serverFull.style.display = 'block';
    serverFull.innerHTML = data;
});

//draw entities and background
setInterval(function(){
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,w,h);
    for(var i in Player.list)
        Player.list[i].draw(ctx);
    for(var i in Ball.list)
        Ball.list[i].draw(ctx);
},20);


//Key handler!
document.addEventListener('keydown', Keys(socket).onkeydown());
document.addEventListener('keyup', Keys(socket).onkeyup());
},{"./entities/ball.js":1,"./entities/player.js":2,"./utils/client.constants.js":4,"./utils/utils.canvas.js":5,"./utils/utils.keys.js":6}],4:[function(require,module,exports){
var constants = {
    w:800,
   	h:500
}
module.exports = constants;
},{}],5:[function(require,module,exports){
module.exports = {

	getPixelRatio : function getPixelRatio(ctx) {
	  console.log('Determining pixel ratio.');

	  // I'd rather not have a giant var declaration block,
	  // so I'm storing the props in an array to dynamically
	  // get the backing ratio.
	  var backingStores = [
	    'webkitBackingStorePixelRatio',
	    'mozBackingStorePixelRatio',
	    'msBackingStorePixelRatio',
	    'oBackingStorePixelRatio',
	    'backingStorePixelRatio'
	  ];

	  var deviceRatio = window.devicePixelRatio;

	  // Iterate through our backing store props and determine the proper backing ratio.
	  var backingRatio = backingStores.reduce(function(prev, curr) {
	    return (ctx.hasOwnProperty(curr) ? ctx[curr] : 1);
	  });

	  // Return the proper pixel ratio by dividing the device ratio by the backing ratio
	  return deviceRatio / backingRatio;
	},

	generateCanvas : function generateCanvas(w, h) {
	  console.log('Generating canvas.');

	  var canvas = document.getElementById('canvas');
	  var ctx = canvas.getContext('2d');
	  // Pass our canvas' context to our getPixelRatio method
	  var ratio = this.getPixelRatio(ctx);

	  // Set the canvas' width then downscale via CSS
	  canvas.width = Math.round(w * ratio);
	  canvas.height = Math.round(h * ratio);
	  canvas.style.width = w +'px';
	  canvas.style.height = h +'px';
	  // Scale the context so we get accurate pixel density
	  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

	  return canvas;
	}
};
},{}],6:[function(require,module,exports){
/** keysDown Utility Module
 * Monitors and determines whether a key
 * is pressed down at any given moment.
 * Returns getters for each key.
 */
var game = require('../game.js');
var Keys = function(socket){
    onkeydown = function(event){
        if(event.keyCode === 83)   //s
            socket.emit('keyPress',{inputId:'down',state:true});
        else if(event.keyCode === 87) // w
            socket.emit('keyPress',{inputId:'up',state:true});
    },

    onkeyup = function(event){
        if(event.keyCode === 83)   //s
            socket.emit('keyPress',{inputId:'down',state:false});
        else if(event.keyCode === 87) // w
            socket.emit('keyPress',{inputId:'up',state:false});
    }
};

module.exports = Keys;
},{"../game.js":3}]},{},[3]);
