var util = require('util');
var extend = require('node.extend');

var IMAGE_URL_ROOT = 'http://www.zettaapi.org/icons/';
var IMAGE_EXTENSION = '.png';

var stateImageForDevice = function(device) {
  return IMAGE_URL_ROOT + device.type + '-' + device.state + IMAGE_EXTENSION;
}

module.exports = function(server) {
  // TODO: swap with server.ql and text
  ['security', 'door', 'window', 'motion', 'photocell', 'thermometer', 'robot'].forEach(function(deviceType){
    var deviceQuery = server.where({type: deviceType});
    server.observe([deviceQuery], function(device) {
      var states = Object.keys(device._allowed);
      for (i = 0; i < states.length; i++) {
        device._allowed[states[i]].push('_update-state-image');
      }
      device._transitions['_update-state-image'] = {
        handler: function(imageURL, tintMode, foregroundColor, cb) {
          if (tintMode !== 'original') {
            tintMode = 'template';
          }
          device.style = extend(true, device.style, {properties: {}});
          device.style.properties = extend(true, device.style.properties, {
            stateImage: {
              url: imageURL,
              tintMode: tintMode
            }
          });
          if (foregroundColor) {
            device.style.properties.stateImage.foregroundColor = foregroundColor;
          }
          cb();
        },
        fields: [
          {name: 'imageURL', type: 'text'},
          {name: 'tintMode', type: 'text'},
          {name: 'foregroundColor', type: 'text'}
        ]
      };

      device.call('_update-state-image', stateImageForDevice(device), 'template', null);
      var stateStream = device.createReadStream('state');
      stateStream.on('data', function(newState) {
        var foregroundColor = null;
        console.log('hello: ' + util.inspect(device.type));
        switch (device.type) {
        case 'security':
          switch (device.state) {
          case 'disarmed':
          case 'disarming':
            foregroundColor = {hex: '#48A70C', decimal: {red: 72, green: 167, blue: 12}};
            break;
          case 'arming-stay':
          case 'armed-stay':
          case 'armed-away':
          case 'arming-away':
            foregroundColor = {hex: '#AD231B', decimal: {red: 173, green: 35, blue: 27}};
            break;
          default:
          }
          break;
        default:
        }
        device.call('_update-state-image', stateImageForDevice(device), 'template', foregroundColor);
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

  var securityQuery = server.where({ type: 'security' });
  server.observe([securityQuery], function(security){
    // add property to track style
    var redColor = {
      backgroundColor: {hex: '#AD231B', decimal: {red: 173, green: 35, blue: 27}},
      foregroundColor: {hex: '#FFFFFF', decimal: {red: 255, green: 255, blue: 255}}
    };
    security.style.actions = extend(true, security.style.actions, {
      'disarm': {
        backgroundColor: {hex: '#48A70C', decimal: {red: 72, green: 167, blue: 12}},
        foregroundColor: {hex: '#FFFFFF', decimal: {red: 255, green: 255, blue: 255}}
      },
      'arm-stay': redColor,
      'arm-away': redColor
    });
  });

  var thermometerQuery = server.where({ type: 'thermometer' });
  server.observe([thermometerQuery], function(thermometer){
    // add property to track style
    thermometer.style.properties.backgroundColor = {decimal: {red: 255, green: 0, blue: 0}, hex: '#FF0000'};
    thermometer.style.properties.foregroundColor = {decimal: {red: 255, green: 255, blue: 255}, hex: '#FFFFFF'};
    thermometer.style.properties = extend(true, thermometer.style.properties, {
      temperature: {
        display: 'billboard',
        significantDigits: 1,
        symbol: '°F'
      },
      stateImage: {
        display: 'none'
      }
    });
  });
}