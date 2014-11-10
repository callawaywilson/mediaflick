$(function() {

  var events = [];

  var endpoint = "https://world.timeout.com/api/events"

  // default to london right now
  var myLocation = {
    lat_low: 51.43690521308246,
    lat_high: 51.584339842658906,
    lon_low: -0.23732195954585222,
    lon_high: 0.031156434008835276
  };
  var today = moment().second(0).minute(0).hour(0);
  var start = moment(today.add('hours', 6));
  var end = moment(today.add('hours', 23).add('minutes', 59));

  $.ajax({
    url: endpoint, 
    data: $.extend(myLocation, {
      start_time: start.format("YYYY-MM-DD HH:mm:ss"),
      end_time: end.format("YYYY-MM-DD HH:mm:ss"),
      viewport: true,
      offset: 0,
      limit: 100,
      media_links: true
    }),
    dataType: 'jsonp'
  }).done(function(response) {
    events = response;
  })

});

function promptLocation() {
  //
}

