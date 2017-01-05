//initializing "classes"
var cUtils = require('./utils/utils.canvas.js');
var Keys = require('./utils/utils.keys.js');
var Constants = require('./utils/client.constants.js');
var Player = require('./entities/player.js');

// Setting up canvas
var w = Constants.w, h = Constants.h;
var canvas = cUtils.generateCanvas(w, h);
var ctx = canvas.getContext('2d');
var serverFull = document.getElementById('full');

//socket connection, and exporting for other files.
var socket = io();
exports.socket = socket;

Player.list = {};

//communication with the server:
socket.on('init', function(data){
    for(var i = 0; i < data.player.length; i++){
        new Player(data.player[i]);
    }
});

socket.on('update', function(data){
    for(var i = 0; i< data.player.length; i++){
        var pack = data.player[i];
        var p = Player.list[pack.id];
        if(p){
            // do I need x?
            if(p.x !== undefined)
                p.x = pack.x;
            if(p.y !== undefined)
                p.y = pack.y;
        }
    }
});

socket.on('remove', function(data){
    for(var i = 0; i < data.player.length; i++)
        delete Player.list[data.player[i]];
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
    for(var i in Player.list){
        Player.list[i].draw(ctx);
    }
},40);


//Key handler!
document.addEventListener('keydown', Keys.onkeydown);
document.addEventListener('keyup', Keys.onkeyup);