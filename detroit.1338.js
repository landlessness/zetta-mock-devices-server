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

var PORT = 1338;

zetta()
  .name('detroit')
  .properties({ style: 
    { 
      backgroundColor: {decimal: {red: 0, green: 35, blue: 80}, hex: '#002350'},
      foregroundColor: {decimal: {red: 255, green: 202, blue: 0}, hex: '#FFCA00'},
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
     console.log('Zetta is running at http://127.0.0.1:', PORT);
});
