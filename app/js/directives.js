'use strict';

/* Directives */

var ptDirectives = angular.module('partytube.directives', ['partytube.services']);

ptDirectives.directive('youtubePlayer', ['YTPlayerService',
  function (YTPlayerService) {
    return {
      restrict: 'A',
      link: function (scope, element) {
        if(!element[0].id)  element[0].id = "yt_player";
        YTPlayerService.bindVideoPlayer(element[0].id);
      }
    };
  }]);
