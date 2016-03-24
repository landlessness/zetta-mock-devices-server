var zetta = require('zetta');
var Light = require('zetta-light-mock-driver');
var Photocell = require('zetta-photocell-mock-driver');
var Security = require('zetta-security-mock-driver');
var Door = require('zetta-door-mock-driver');
var Thermometer = require('zetta-thermometer-mock-driver');
var Camera = require('zetta-camera-mock-driver');
var Robot = require('zetta-robot-mock-driver');
// Add mock emergency buttons for calling police and fire
var duskToDawnLight = require('./apps/dusk_to_dawn_light');
var style = require('./apps/style');

var SERVER_NAME = process.argv[2]
var PORT = process.argv[3];

var parseCommandLineColor = function(colorString) {
  colorValues = colorString.split(':');
  return {
    decimal: {
      red: colorValues[0],
      green: colorValues[1],
      blue: colorValues[2]
    },
    hex: colorValues[3]
  };
}

var FOREGROUND_COLOR = parseCommandLineColor(process.argv[4]);
var BACKGROUND_COLOR = parseCommandLineColor(process.argv[5]);

zetta()
  .name(SERVER_NAME)
  .properties({ style: 
    { 
      foregroundColor: FOREGROUND_COLOR,
      backgroundColor: BACKGROUND_COLOR,
      devices: [{
        photocell: {
          properties: [{
            property: 'state',
            display: 'none'
          },{
            property: 'intensity',
            display: 'inline',
            significantDigits: 3,
            symbol: 'lx'
          }]
        }
      }]
    }})
  .use(Light)
  .use(Photocell)
  .use(Security)
  .use(Door)
  .use(Thermometer)
  .use(Camera)
  .use(Robot)
  .use(duskToDawnLight)
  .use(style)
  .link('http://demo.zettaapi.org/')
  .listen(PORT, function(){
     console.log('Zetta server ' + SERVER_NAME + ' is running at http://127.0.0.1:' + PORT);
});


// node server.js detroit 1337 255:202:0:#FFCA00 0:35:80:#002350
// pm2 start server.js --name detroit -- detroit 1337 255:202:0:#FFCA00 0:35:80:#002350