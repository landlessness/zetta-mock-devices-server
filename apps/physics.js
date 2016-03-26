var util = require('util');

module.exports = function(server) {
  var robotQuery = server.where({ type: 'robot' });
  var doorQuery = server.where({ type: 'door' });
  var windowQuery = server.where({ type: 'window' });
  console.log('physics');
  server.observe([robotQuery, doorQuery, windowQuery], function(robot, door, window){
    console.log('physics observe');
    var stateStream = robot.createReadStream('state');
    stateStream.on('data', function(newState) {
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
