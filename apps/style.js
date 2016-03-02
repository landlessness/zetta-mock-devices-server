var extend = require('node.extend');

var DOOR_CLOSED_IMAGE_URL = 'https://cdn0.iconfinder.com/data/icons/mobile-development-svg-icons/60/closed_door-512.png';
var DOOR_OPENED_IMAGE_URL = 'https://cdn0.iconfinder.com/data/icons/mobile-development-svg-icons/60/open_door-512.png';

module.exports = function(server) {
  var photocellQuery = server.where({ type: 'photocell' });
  server.observe([photocellQuery], function(photocell){
    // add property to track style
    photocell.style = {};
    // wrap it in a WebSockets monitor
    photocell._initMonitor('style');
    photocell._monitors.push('style');
    photocell.style.displays = [
      {
        indicator: 'state',
        display: 'none'
      },
      {
	indicator: 'intensity',
        display: 'billboard',
        position: 10,
        significantDigits: 3,
        symbol: 'lx',
      },
      {
        indicator: 'intensity',
        display: 'lineChart',
        position: 20,
        significantDigits: 3,
        symbol: 'lx',
      }
    ]
  });

  var doorSensorQuery = server.where({ type: 'door' });
  server.observe([doorSensorQuery], function(doorSensor){
    // add property to track style
    doorSensor.style = {};
    // wrap it in a WebSockets monitor
    doorSensor._initMonitor('style');
    doorSensor._monitors.push('style');
    // set the default image
    doorSensor.style.stateImage = DOOR_CLOSED_IMAGE_URL;
    doorSensor.style.defaultImage = DOOR_CLOSED_IMAGE_URL;
    // change the state image when door changes state
    doorSensor.on('force-mock-close', function(s) {
      doorSensor.style = extend(doorSensor.style, {stateImage: DOOR_CLOSED_IMAGE_URL});
    });
    doorSensor.on('force-mock-open', function(s) {
      doorSensor.style = extend(doorSensor.style, {stateImage: DOOR_OPENED_IMAGE_URL});
    });
  });
};
