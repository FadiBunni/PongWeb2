/** Game Update Module
 * Called by the game loop, this module will
 * perform any state calculations / updates
 * to properly render the next frame.
 */

 function gameUpdate(scope) {
 	return function update(tFrame){
 		var state = scope.state || {};

 		//if there are entities, iterate through then and call their 'update' methods
 		if(state.hasOwnProperty('entities')) {
 			var entities = state.entities;
 			//loop through entities
 			for(var entity in entities){
 			// fire off each active entities 'render' method
 			entities[entity].update();
 			}
 		}
 		return state;
 	}
 }

 module.exports = gameUpdate;