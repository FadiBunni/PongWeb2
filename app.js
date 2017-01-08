var path = require('path');
var express = require('express');
var app = express();
var serv = require('http').Server(app);
var io = require('socket.io')(serv,{});
var Player = require('./server/js/entities/player.js');
var Ball = require('./server/js/entities/ball.js');
//var Constants = require('./server/js/utils/server.constants.js');

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(path.join(__dirname + '/client')));

serv.listen(2000);
console.log("Server started.");

var SOCKET_LIST = {};

Player.list = {};
Ball.list = {};

Player.onConnect = function (socket, side) {
    var player = Player(socket.id, side);
    socket.on('keyPress',function(data){
        if(data.inputId === 'up')
            player.pressingUp = data.state;
        else if(data.inputId === 'down')
            player.pressingDown = data.state;
    });

    socket.emit('init',{
        player:Player.getAllInitPack(),
        ball:[],
    });
}

Player.getAllInitPack = function(){
    var players = [];
    for(var i in Player.list)
        players.push(Player.list[i].getInitPack());
    return players;
}

Player.onDisconnect = function(socket) {
    delete Player.list[socket.id];
    removePack.player.push(socket.id);
}

Player.update = function(){
    var pack = [];
    for(var i in Player.list){
        var player = Player.list[i];
        player.update();
        pack.push(player.getUpdatePack());
    }
    return pack;
}

Ball.onConnect = function(players, socket) {
    var ball = Ball(players);
    socket.emit('init',{
        ball:Ball.getAllInitPack(),
        player:[]
    });
}

Ball.getAllInitPack = function() {
    var balls = [];
    for(var i in Ball.list)
        balls.push(Ball.list[i].getInitPack());
    return balls;
}

Ball.onDisconnect = function() {
    removePack.ball.push(ball.id);
}

Ball.update = function() {
    var pack = [];
    for(var i in Ball.list){
        var ball = Ball.list[i];
        if(Object.keys(SOCKET_LIST).length === 2){
            ball.update();
            pack.push(ball.getUpdatePack());
        }
    }
    return pack;
}

io.on('connection', function(socket){
    socket.id = Math.random();
    console.log("socket id:" + socket.id);

    SOCKET_LIST[socket.id] = socket;
    console.log("socket connections: " + Object.keys(SOCKET_LIST).length);

    if(Object.keys(SOCKET_LIST).length == 1){
        Player.onConnect(socket, "left");
    }else if(Object.keys(SOCKET_LIST).length == 2) {
        Player.onConnect(socket, "right");
        Ball.onConnect(Player.list, socket);
    }else if (Object.keys(SOCKET_LIST).length >= 3){
        socket.emit("serverIsFull", "The game server is full for now.");
        delete SOCKET_LIST[socket.id];
        Player.onDisconnect(socket);
    }

    socket.on('disconnect',function(){
        delete SOCKET_LIST[socket.id];
        Player.onDisconnect(socket);
        console.log("socket connections: " + Object.keys(SOCKET_LIST).length);
    });
});
var initPack = {player:[],ball:[]};
exports.initPack = initPack;
var removePack = {player:[],ball:[]};

setInterval(function(){
    var pack = {
        player:Player.update(),
        ball:Ball.update(),
    }
    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('init',initPack);
        socket.emit('update',pack);
        socket.emit('remove',removePack);
    }
    initPack.player = [];
    initPack.ball = [];
    removePack.player = [];
    removePack.ball = [];
},1000/60);