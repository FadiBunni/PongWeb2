var path = require('path');
var express = require('express');
var app = express();
var serv = require('http').Server(app);
var io = require('socket.io')(serv,{});
var Player = require('./server/js/entities/player.js');
//var Entity = require('./server/js/entities/entity.js');

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(path.join(__dirname + '/client')));
//app.use(express.static(path.join(__dirname, 'client')));

serv.listen(2000);
console.log("Server started.");

var SOCKET_LIST = {};

Player.list = {};

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
        player.sideCollision();
        pack.push(player.getUpdatePack());
    }
    return pack;
}

io.sockets.on('connection', function(socket){
    if(Object.keys(SOCKET_LIST).length == 1){
        socket.id = Math.random();
    }
    console.log("socket id:" + socket.id);
    SOCKET_LIST[socket.id] = socket;
    console.log("socket connections: " + Object.keys(SOCKET_LIST).length);
    if(Object.keys(SOCKET_LIST).length == 1){
        Player.onConnect(socket, "left");
    }else if(Object.keys(SOCKET_LIST).length == 2) {
        Player.onConnect(socket, "right");
    }else if (Object.keys(SOCKET_LIST).length >= 3){
        socket.emit("serverIsFull", "The game server is full for now.");
        delete SOCKET_LIST[socket.id];
    }

    socket.on('disconnect',function(){
        delete SOCKET_LIST[socket.id];
        Player.onDisconnect(socket);
       console.log("socket connections: " + Object.keys(SOCKET_LIST).length);
    });
});
var removePack = {player:[]};
var initPack = {player:[]};
exports.initPack = initPack;

setInterval(function(){
    var pack = {
        player:Player.update()
    }

    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('init',initPack);
        socket.emit('update',pack);
        socket.emit('remove',removePack);
    }
    initPack.player = [];
    removePack.player = [];
},1000/100);