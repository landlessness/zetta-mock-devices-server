var zetta = require('zetta');
var Light = require('zetta-light-mock-driver');
var Photocell = require('zetta-photocell-mock-driver');
var Security = require('zetta-security-mock-driver');
var Door = require('zetta-door-mock-driver');
var style = require('./apps/style');

var duskToDawnLight = require('./apps/dusk_to_dawn_light');

var PORT = 1339;

zetta()
  .name('bangalore')
  .properties({ style: 
    { 
      foregroundColor: {decimal: {red: 193, green: 80, blue: 32}, hex: '#C15020'}
    }})
  .use(Light)
  .use(Photocell)
  .use(Security)
  .use(Door)
  .use(style)
  .use(duskToDawnLight)
  .link('http://demo.zettaapi.org/')
  .listen(PORT, function(){
     console.log('Zetta is running at http://127.0.0.1:', PORT);
});
