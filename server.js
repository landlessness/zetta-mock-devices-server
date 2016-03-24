var zetta = require('zetta');
var Light = require('zetta-light-mock-driver');
var Photocell = require('zetta-photocell-mock-driver');
var Security = require('zetta-security-mock-driver');
var Door = require('zetta-door-mock-driver');
var Thermometer = require('zetta-thermometer-mock-driver');
var Camera = require('zetta-camera-mock-driver');
var Robot = require('zetta-robot-mock-driver');
// TODO: Add mock emergency buttons for calling police and fire
var duskToDawnLight = require('./apps/dusk_to_dawn_light');
var style = require('./apps/style');

var extend = require('node.extend');

var SERVER_NAME = process.argv[2]
var PORT = process.argv[3];
var LINK_URL = process.argv[4];

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
};

var styleProperties = { 
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
    };

if (process.argv[5]) {
  styleProperties = extend(styleProperties, {foregroundColor: parseCommandLineColor(process.argv[5])});
  if (process.argv[6]) {
    styleProperties = extend(styleProperties, {backgroundColor: parseCommandLineColor(process.argv[6])});
  }
}

zetta()
  .name(SERVER_NAME)
  .properties({style: styleProperties})
  .use(Light)
  .use(Photocell)
  .use(Security)
  .use(Door)
  .use(Thermometer)
  .use(Camera)
  .use(Robot)
  .use(duskToDawnLight)
  .use(style)
  .link(LINK_URL)
  .listen(PORT, function(){
     console.log('Zetta server ' + SERVER_NAME + ' is running at http://127.0.0.1:' + PORT);
});


// node server.js detroit 1370 255:202:0:#FFCA00 0:35:80:#002350 http://dev.zettaapi.org

// BANGALORE
// pm2 start server.js --name stage.bangalore.1371 -- bangalore 1371 http://stage.zettaapi.org 193:80:32:#C15020

// DENVER
// pm2 start server.js --name stage.denver.1372 -- denver 1372 http://stage.zettaapi.org

// DETROIT
// pm2 start server.js --name stage.detroit.1373 -- detroit http://stage.zettaapi.org 1373 255:202:0:#FFCA00 0:35:80:#002350 

// DUBLIN
// pm2 start server.js --name stage.dublin.1374 -- dublin http://stage.zettaapi.org 1374 255:255:255:#FFFFFF 0:155:72:#009B48

// NEW ORLEANS
// pm2 start server.js --name stage.neworleans.1375 -- neworleans http://stage.zettaapi.org 1375 98:47:187:#622FBB

// SAN FRANCISCO
// pm2 start server.js --name stage.sanfrancisco.1376 -- sanfrancisco http://stage.zettaapi.org 1376 255:215:0:#FFD700

// SINGAPORE
// pm2 start server.js --name stage.singapore.1377 -- singapore http://stage.zettaapi.org 1377 
