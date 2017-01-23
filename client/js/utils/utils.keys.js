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