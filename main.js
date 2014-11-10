var events;

$(function() {

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
    crossDomain: true
  }).done(function(data) {
    displayPlayer(data);
    events = data;
  }).fail(function() {
    console.log("Error getting events");
  })

});

function promptLocation() {
  //
}

function addEventToList(event) {
  var compiledTemplate = _.template($("#event-template").html());
  $("#list-container").prepend(compiledTemplate(event));
}

function urlParser(url) {
    var parser = document.createElement('a');
    parser.href = url;
    return parser;
}

var players = {
  youtube: function(url) {
    var code = urlParser(url).search.substr(3).split('&')[0];
    return '<iframe src="http://www.youtube.com/embed/' + code + '?autoplay=1" frameborder="0"><iframe/>';
  },
  soundcloud: function(url) {
    var code = urlParser(url).pathname;
    return '<iframe src="https://w.soundcloud.com/player/?url=soundcloud.com' + code + '&amp;auto_play=true&amp;buying=false&amp;liking=false&amp;download=false&amp;sharing=false&amp;show_artwork=false&amp;show_comments=false&amp;show_playcount=false&amp;show_user=false&amp;hide_related=true&amp;visual=true&amp;start_track=0&amp;callback=true" class="iframe" scrolling="no" frameborder="no"></iframe>';
  },
  vimeo: function(url) {
    var code = urlParser(url).pathname;
    return '<iframe src="//player.vimeo.com/video' + code + '?autoplay=1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
  }
}

function play(songs) {
  var song = _.first(songs);
  var rest = _.rest(songs);
  $('.media-box').html(players[song.player](song.url));
  if(rest.length > 0) {
    $('.media-button-no').unbind('click').click(function() { play(rest) });
  } else {
    $('.media-button-no').attr('disabled', 'disabled');
  }
}

function displayPlayer(data) {

  var songs = _.chain(data)
    .map(function(event) { return _.map(event.media_links, function(link) { return {
      player: (link.site_name) ? link.site_name.toLowerCase() : '',
      url:    link.url,
      event:  event
    }})})
    .flatten()
    .filter(function(event) { return _.has(players, event.player) })
    .shuffle()
    .value();

  play(songs);
}