var zetta = require('zetta');
var LED = require('zetta-led-mock-driver');
var Photocell = require('zetta-photocell-mock-driver');
var Security = require('zetta-security-mock-driver');
var Door = require('zetta-door-mock-driver');
// Add mock emergency buttons for calling police and fire
var duskToDawnLight = require('./apps/dusk_to_dawn_light');
var style = require('./apps/style');

var PORT = 1338;

zetta()
  .name('detroit')
  .properties({style: {colors: {primary: {decimal: {red: 0, green: 32, blue: 94}, hex: '#00205E'}}}})
  .use(LED)
  .use(Photocell)
  .use(Security)
  .use(Door)
  .use(duskToDawnLight)
  .use(style)
  .link('http://demo.zettaapi.org/')
  .listen(PORT, function(){
     console.log('Zetta is running at http://127.0.0.1:', PORT);
});
