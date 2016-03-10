var zetta = require('zetta');
var LED = require('zetta-led-mock-driver');
var Photocell = require('zetta-photocell-mock-driver');

var duskToDawnLight = require('./apps/dusk_to_dawn_light');

var PORT = 1340;

zetta()
  .name('dublin')
  .properties({style: {colors: {primary: {decimal: {red: 0, green: 155, blue: 72}, hex: '#009B48'}}}})
  .use(LED)
  .use(Photocell)
  .use(duskToDawnLight)
  .link('http://demo.zettaapi.org/')
  .listen(PORT, function(){
     console.log('Zetta is running at http://127.0.0.1:', PORT);
});
