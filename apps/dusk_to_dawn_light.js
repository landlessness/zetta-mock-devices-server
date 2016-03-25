module.exports = function(server) {
  var photocellQuery = server.where({ type: 'photocell' });
  var lightQuery = server.where({ type: 'light' });
  server.observe([photocellQuery, lightQuery], function(photocell, light){
    photocell.streams.intensity.on('data', function(m) {
      if(m.data < 0.5) {
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
