var cUtils = require('./utils/utils.canvas.js');
var Player = require('./entities/player.js');

var w = window.innerWidth;
var h = window.innerHeight;

var canvas = cUtils.generateCanvas(w, h);
var ctx = canvas.getContext('2d');


var socket = io();

Player.list = {};

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

setInterval(function(){
    ctx.clearRect(0,0,w,h);
    for(var i in Player.list)
        ctx.fillText(Player.list[i].number, Player.list[i].x, Player.list[i].y);
},40);

document.onkeydown = function(event){
    if(event.keyCode === 83)   //s
        socket.emit('keyPress',{inputId:'down',state:true});
    else if(event.keyCode === 87) // w
        socket.emit('keyPress',{inputId:'up',state:true});

}
document.onkeyup = function(event){
    if(event.keyCode === 83)   //s
        socket.emit('keyPress',{inputId:'down',state:false});
    else if(event.keyCode === 87) // w
        socket.emit('keyPress',{inputId:'up',state:false});
}