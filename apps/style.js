var extend = require('node.extend');
var util = require('util');

var IMAGE_URL_ROOT = 'http://www.zettaapi.org/icons/';
var IMAGE_EXTENSION = '.png';

var imageForTypeState = function(type, state) {
  return IMAGE_URL_ROOT + type + '-' + state + IMAGE_EXTENSION;
}

module.exports = function(server) {
  var deviceType = 'door'
  var deviceQuery = server.where({ type: deviceType });
  server.observe([deviceQuery], function(device){
    var stateStream = device.createReadStream('state');

    // add property to track style
    device.style = {};
    stateStream.on('data', function(newState) {
      device.style = extend(
        device.style, 
        {stateImage: imageForTypeState(deviceType, newState.data)}
      );
    });
  });
  
  var photocellQuery = server.where({ type: 'photocell' });
  server.observe([photocellQuery], function(photocell){
    // add property to track style
    photocell.style = {};
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
};
