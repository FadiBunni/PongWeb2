/** keysDown Utility Module
 * Monitors and determines whether a key
 * is pressed down at any given moment.
 * Returns getters for each key.
 */
var socket = io();
module.exports = {

    onkeydown: function(event){
        if(event.keyCode === 83)   //s
            socket.emit('keyPress',{inputId:'down',state:true});
        else if(event.keyCode === 87) // w
            socket.emit('keyPress',{inputId:'up',state:true});
    },

    onkeyup: function(event){
        if(event.keyCode === 83)   //s
            socket.emit('keyPress',{inputId:'down',state:false});
        else if(event.keyCode === 87) // w
            socket.emit('keyPress',{inputId:'up',state:false});
    }
};