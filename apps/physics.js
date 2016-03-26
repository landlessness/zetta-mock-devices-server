var util = require('util');

module.exports = function(server) {
  var robotQuery = server.where({ type: 'robot' });
  var doorQuery = server.where({ type: 'door' });
  var windowQuery = server.where({ type: 'window' });
  var motionQuery = server.where({ type: 'motion' });
  server.observe([robotQuery, doorQuery, windowQuery, motionQuery], function(robot, door, window, motion){
    var stateStream = robot.createReadStream('state');
    stateStream.on('data', function(newState) {
      console.log('newState: ' + util.inspect(newState));
      if (newState.data === 'standing' || newState.data === 'sitting') {
        if (motion.available('deactivate')) {
          motion.call('deactivate');
        }
      } else {
        if (motion.available('activate')) {
          motion.call('activate');
        }
      }
      switch (newState.data) {
      case 'opening-door':
        if (door.available('open')) {
          door.call('open');
        }
        break;
      case 'closing-door':
        if (door.available('close')) {
          door.call('close');
        }
        break;
      case 'opening-window':
        if (window.available('open')) {
          window.call('open');
        }
        break;
      case 'closing-window':
        if (window.available('close')) {
          window.call('close');
        }
        break;
      }
    });
  });
}
