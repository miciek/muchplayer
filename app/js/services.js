'use strict';

/* Services */

var ptServices = angular.module('partytube.services', ['ngResource']);

ptServices.factory('YTSearchResult', ['$resource',
  function($resource){
    return $resource('https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=:q&key=AIzaSyAjYBy_o8ahk-ckWEzDIMCqIqdaswwPRAs');
  }]);

ptServices.run(
  function () {
    var tag = document.createElement('script');
    tag.src = "//www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  });

ptServices.service('YTPlayerService', ['$window', '$rootScope',
  function ($window, $rootScope) {
    var service = $rootScope.$new(true);

    service.ready = false;
    service.playerId = null;
    service.player = null;
    service.playerHeight = '390';
    service.playerWidth = '640';

    // YouTube required callback when API is ready
    $window.onYouTubeIframeAPIReady = function () {
      service.ready = true;
    };

    service.bindVideoPlayer = function (elementId) {
      service.playerId = elementId;
    };

    service.createPlayer = function (videoId, onReadyFunc) {
      return new YT.Player(this.playerId, {
        height: this.playerHeight,
        width: this.playerWidth,
        videoId: videoId,
        events: {
          'onReady': onReadyFunc
        }
      });
    };

    service.play = function (videoId) {
      if (this.ready && this.playerId) {
        if(this.player) {
          this.player.destroy();
        }

        this.player = this.createPlayer(videoId, function(event) {
          service.player.playVideo();
        });
      }
    };

    return service;
  }]);
