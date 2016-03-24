var util = require('util');
var extend = require('node.extend');

var IMAGE_URL_ROOT = 'http://www.zettaapi.org/icons/';
var IMAGE_EXTENSION = '.png';

var stateImageForDevice = function(device) {
  return IMAGE_URL_ROOT + device.type + '-' + device.state + IMAGE_EXTENSION;
}

module.exports = function(server) {
  console.log('util.inspect(server): ' + util.inspect(server));

  // TODO: swap with server.ql and text
  ['security', 'door', 'photocell', 'light', 'thermometer', 'camera', 'robot'].forEach(function(deviceType){
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
          device.style = extend(device.style, {stateImage: {url: imageURL, tintMode: tintMode}});
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

      var hideUpdateStateImageAction = {
        action: '_update-state-image',
        display: 'none'
      };
      if (typeof device.style.actions === 'undefined' || device.style.actions.constructor !== Array) {
        device.style.actions = [hideUpdateStateImageAction];
      } else {
        device.style.actions.push(hideUpdateStateImageAction);
      }
      
    });
  });
  
  var photocellQuery = server.where({ type: 'photocell' });
  server.observe([photocellQuery], function(photocell){
    // add property to track style
    photocell.style.properties = [
      {
        property: 'intensity',
        display: 'billboard',
        significantDigits: 3,
        symbol: 'lx'
      },
      {
        property: 'stateImage',
        display: 'none'
      }
    ];
  });

  var securityQuery = server.where({ type: 'security' });
  server.observe([securityQuery], function(security){
    // add property to track style
    security.style.backgroundColor = {decimal: {red: 255, green: 0, blue: 0}, hex: '#FF0000'};
    security.style.foregroundColor = {decimal: {red: 255, green: 255, blue: 255}, hex: '#FFFFFF'};
  });

}