var util = require('util');
var extend = require('node.extend');

var IMAGE_URL_ROOT = 'http://www.zettaapi.org/icons/';
var IMAGE_EXTENSION = '.png';

var stateImageForDevice = function(device) {
  return IMAGE_URL_ROOT + device.type + '-' + device.state + IMAGE_EXTENSION;
}

module.exports = function(server) {
  // TODO: swap with server.ql and text
  ['security', 'door', 'window', 'motion', 'photocell', 'light', 'thermometer', 'robot'].forEach(function(deviceType){
    var deviceQuery = server.where({type: deviceType});
    server.observe([deviceQuery], function(device) {
      var states = Object.keys(device._allowed);
      for (i = 0; i < states.length; i++) {
        device._allowed[states[i]].push('_update-state-image');
      }
      device._transitions['_update-state-image'] = {
        handler: function(imageURL, tintMode, cb) {
          if (tintMode !== 'original') {
            tintMode = 'template';
          }
          device.style = extend(true, device.style, {properties: {}});
          device.style.properties = extend(true, device.style.properties, {stateImage: {url: imageURL, tintMode: tintMode}});
          cb();
        },
        fields: [
          {name: 'imageURL', type: 'text'},
          {name: 'tintMode', type: 'text'}
        ]
      };

      device.call('_update-state-image', stateImageForDevice(device), 'template');
      var stateStream = device.createReadStream('state');
      stateStream.on('data', function(newState) {
        device.call('_update-state-image', stateImageForDevice(device), 'template');
      });

      device.style.actions = extend(true, device.style.actions, {'_update-state-image': {display: 'none'}});

    });
  });
  
  var photocellQuery = server.where({ type: 'photocell' });
  server.observe([photocellQuery], function(photocell){
    // add property to track style
    photocell.style.properties = extend(true, photocell.style.properties, {
      intensity: {
        display: 'billboard',
        significantDigits: 3,
        symbol: 'lx'
      },
      stateImage: {
        display: 'none'
      }
    });
  });

  if (server.httpServer.zetta._name === 'neworleans') {
    var securityQuery = server.where({ type: 'security' });
    server.observe([securityQuery], function(security){
      // add property to track style
      security.style.properties.backgroundColor = {decimal: {red: 255, green: 0, blue: 0}, hex: '#FF0000'};
      security.style.properties.foregroundColor = {decimal: {red: 255, green: 255, blue: 255}, hex: '#FFFFFF'};
    });
  }

}