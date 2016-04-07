module.exports = function(server) {
  var photocellQuery = server.where({ type: 'photocell' });
  var lightQuery = server.where({ name: 'Porch Light' });
  server.observe([photocellQuery, lightQuery], function(photocell, light){
    photocell.streams.intensity.on('data', function(m) {
      if(m.data < 1.0) {
        if (light.available('turn-on')) {
          light.call('turn-on');
        }
      } else {
        if (light.available('turn-off')) {
          light.call('turn-off');
       }
     }
   });
});}
