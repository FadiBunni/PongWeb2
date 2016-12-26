/** keysDown Utility Module
 * Monitors and determines whether a key
 * is pressed down at any given moment.
 * Returns getters for each key.
 */

function Keys() {

    this.isPressed = {};

    var playerKeys = {
        p1: {
            up: false,
            down: false
        },
        p2: {
            up: false,
            down: false
        }
    };

     // Set up `onkeyup` event handler.
    document.onkeyup = function (ev) {
        if (ev.which === 87) { playerKeys.p1.up = false; }
        if (ev.which === 83) { playerKeys.p1.down = false; }
        if (ev.which === 38) { playerKeys.p2.up = false; }
        if (ev.which === 40) { playerKeys.p2.down = false; }
    };

    // Set up `onkeydown` event handler.
    document.onkeydown = function (ev) {
        if (ev.which === 87) { playerKeys.p1.up = true; }
        if (ev.which === 83) { playerKeys.p1.down = true; }
        if (ev.which === 38) { playerKeys.p2.up = true; }
        if (ev.which === 40) { playerKeys.p2.down = true; }
    };

    Object.defineProperty(this.isPressed, 'playerKeys', {
        get: function() {return playerKeys; },
        configurable: true,
        enumerable: true
    });

    return this;
}

module.exports = Keys();