var zetta = require('zetta');
var LED = require('zetta-led-mock-driver');
var Photocell = require('zetta-photocell-mock-driver');

var duskToDawnLight = require('./apps/dusk_to_dawn_light');

var PORT = 1341;

zetta()
  .name('neworleans')
  .use(LED)
  .use(Photocell)
  .use(duskToDawnLight)
  .link('http://demo.zettaapi.org/')
  .listen(PORT, function(){
     console.log('Zetta is running at http://127.0.0.1:', PORT);
});
