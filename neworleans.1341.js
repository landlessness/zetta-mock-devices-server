var zetta = require('zetta');
var LED = require('zetta-led-mock-driver');
var Photocell = require('zetta-photocell-mock-driver');
var Door = require('zetta-door-mock-driver');
var duskToDawnLight = require('./apps/dusk_to_dawn_light');
var style = require('./apps/style');

var PORT = 1341;

zetta()
  .name('neworleans')
  .properties({style: {brandColors: {primary: {decimal: {red: 98, green: 147, blue: 187}, hex: '#622FBB'}}}})
  .use(LED)
  .use(Photocell)
  .use(Door)
  .use(duskToDawnLight)
  .use(style)
  .link('http://demo.zettaapi.org/')
  .listen(PORT, function(){
     console.log('Zetta is running at http://127.0.0.1:', PORT);
});
