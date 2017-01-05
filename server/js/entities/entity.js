var Constants = require('../utils/server.constants.js');
var Entity = function(){
    var self = {
        x:20,
        //husk at lave en kostant liste, som du kan hente w og h for window.
        y: Constants.h/2 - 140/2,
        spdX:0,
        spdY:0,
        id:""
    }

    self.update = function(){
        self.updatePosition();
    }
    self.updatePosition = function(){
        self.x += self.spdX;
        self.y += self.spdY;
    }
    return self;
}

module.exports = Entity;