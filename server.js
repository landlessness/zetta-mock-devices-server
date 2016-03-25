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
var argv = require('minimist')(process.argv.slice(2));
console.log(argv);

var SERVER_NAME = argv['s'];
var PORT = argv['p'];
var LINK_URL = argv['l'];

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

if (argv['f']) {
  styleProperties = extend(styleProperties, {foregroundColor: parseCommandLineColor(argv['f'])});
}
if (argv['b']) {
  styleProperties = extend(styleProperties, {backgroundColor: parseCommandLineColor(argv['b'])});
}

var cameraImage = argv['c'];

zetta()
  .name(SERVER_NAME)
  .properties({style: styleProperties})
  .use(Light)
  .use(Photocell)
  .use(Security)
  .use(Door)
  .use(Thermometer)
  .use(Camera, cameraImage)
  .use(Robot)
  .use(duskToDawnLight)
  .use(style)
  .link(LINK_URL)
  .listen(PORT, function(){
     console.log('Zetta server ' + SERVER_NAME + ' is running at http://127.0.0.1:' + PORT);
});


// node server.js detroit 1370 255:202:0:#FFCA00 0:35:80:#002350 http://dev.zettaapi.org

// BANGALORE
// pm2 start server.js  --name stage.bangalore.1371 -- -s bangalore -p 1371 -l http://stage.zettaapi.org -f 193:80:32:#C15020 -c http://www.zettaapi.org/public/demo/bangalore.jpg

// DENVER
// pm2 start server.js  --name stage.denver.1372 -- -s denver -p 1372 -l http://stage.zettaapi.org -c http://www.zettaapi.org/public/demo/denver.jpg

// DETROIT
// pm2 start server.js  --name stage.detroit.1373 -- -s detroit -p 1373 -l http://stage.zettaapi.org -f 255:202:0:#FFCA00 -b 0:35:80:#002350 -c http://www.zettaapi.org/public/demo/detroit.jpg

// DUBLIN
// pm2 start server.js  --name stage.dublin.1374 -- -s dublin -l http://stage.zettaapi.org -p 1374 -f 255:255:255:#FFFFFF -b 0:155:72:#009B48 -c http://www.zettaapi.org/public/demo/dublin.jpg

// NEW ORLEANS
// pm2 start server.js  --name stage.neworleans.1375 -- -s neworleans -l http://stage.zettaapi.org -p 1375 -f 98:47:187:#622FBB -c http://www.zettaapi.org/public/demo/neworleans.jpg

// SAN FRANCISCO
// pm2 start server.js  --name stage.sanfrancisco.1376 -- -s sanfrancisco -l http://stage.zettaapi.org -p 1376 -f 255:215:0:#FFD700  -c http://www.zettaapi.org/public/demo/sanfrancisco.jpg

// SINGAPORE
// pm2 start server.js  --name stage.singapore.1377 -- -s singapore -l http://stage.zettaapi.org -p 1377 -c http://www.zettaapi.org/public/demo/singapore.jpg
