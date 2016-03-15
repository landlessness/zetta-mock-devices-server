var zetta = require('zetta');
var Light = require('zetta-light-mock-driver');
var Photocell = require('zetta-photocell-mock-driver');

var style = require('./apps/style');
var duskToDawnLight = require('./apps/dusk_to_dawn_light');

var PORT = 1340;

zetta()
  .name('dublin')
  .properties({ style: 
      { 
        backgroundColor: {decimal: {red: 0, green: 155, blue: 72}, hex: '#009B48'},
        foregroundColor: {decimal: {red: 255, green: 255, blue: 255}, hex: '#FFFFFF'}
      }})
  .use(Light)
  .use(Photocell)
  .use(style)
  .use(duskToDawnLight)
  .link('http://demo.zettaapi.org/')
  .listen(PORT, function(){
     console.log('Zetta is running at http://127.0.0.1:', PORT);
});
