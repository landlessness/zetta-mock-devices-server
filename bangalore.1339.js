var zetta = require('zetta');
var Light = require('zetta-light-mock-driver');
var Photocell = require('zetta-photocell-mock-driver');

var duskToDawnLight = require('./apps/dusk_to_dawn_light');

var PORT = 1339;

zetta()
  .name('bangalore')
  .properties({style: {colors: {primary: {decimal: {red: 193, green: 80, blue: 32}, hex: '#C15020'}}}})
  .use(Light)
  .use(Photocell)
  .use(duskToDawnLight)
  .link('http://demo.zettaapi.org/')
  .listen(PORT, function(){
     console.log('Zetta is running at http://127.0.0.1:', PORT);
});
