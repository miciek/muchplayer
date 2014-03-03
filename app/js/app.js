'use strict';

angular.module('partytube', [
  'partytube.controllers',
  'partytube.directives'
]);

function resize() {
  $('#queue-list').height(($(window).height() - $('#player').height()) + 'px');
}

$(document).ready(function() {
  resize();

  $(window).resize(function() {
    resize();
  });
});



