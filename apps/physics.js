var util = require('util');

module.exports = function(server) {
  var robotQuery = server.where({ type: 'robot' });
  var doorQuery = server.where({ type: 'door' });
  var windowQuery = server.where({ type: 'window' });
  var motionQuery = server.where({ type: 'motion' });
  server.observe([robotQuery, doorQuery, windowQuery, motionQuery], function(robot, door, window, motion){
    var stateStream = robot.createReadStream('state');
    stateStream.on('data', function(newState) {
      if (newState.data === 'standing' || newState.data === 'sitting') {
        if (motion.available('no-motion')) {
          motion.call('no-motion');
        }
      } else {
        if (motion.available('motion')) {
          motion.call('motion');
        }
      }
      switch (newState.data) {
      case 'opening-door':
        // a reed switch opens as soon as opening begins
        if (door.available('open')) {
          door.call('open');
        }
        break;
      case 'finished-closing-door':
        // but a reed switch closes only after closing is complete
        if (door.available('close')) {
          door.call('close');
        }
        break;
      case 'opening-window':
        // a reed switch opens as soon as opening begins
        if (window.available('open')) {
          window.call('open');
        }
        break;
      case 'finished-closing-window':
        // but a reed switch closes only after closing is complete
        if (window.available('close')) {
          window.call('close');
        }
        break;
      }
    });
  });
}
