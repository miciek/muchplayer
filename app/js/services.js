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

ptServices.service('YTPlayerService', ['$window', '$rootScope', '$log',
  function ($window, $rootScope, $log) {
    var service = $rootScope.$new(true);

    service.ready = false;
    service.playerId = null;
    service.player = null;
    service.playerHeight = '390';
    service.playerWidth = '640';
    service.current = null;
    service.endedCallback = null;

    // YouTube required callback when API is ready
    $window.onYouTubeIframeAPIReady = function () {
      service.ready = true;
    };

    service.bindVideoPlayer = function (elementId) {
      service.playerId = elementId;
    };

    service.createPlayer = function (videoId) {
      return new YT.Player(this.playerId, {
        height: this.playerHeight,
        width: this.playerWidth,
        videoId: videoId,
        events: {
          'onReady': onReadyFunc,
          'onStateChange': onStateChangeFunc,
          'onError': onErrorFunc
        }
      });
    };

    service.play = function (video) {
      if(this.ready && this.playerId) {
        if(this.player) {
          this.player.loadVideoById(video.id);
        } else {
          this.player = this.createPlayer(video.id);
        }
        this.current = video;
      }
    };

    service.clear = function() {
      if(this.player) {
        this.player.stopVideo();
        this.current = null;
      }
    };

    service.performEndedCallback = function() {
      if(typeof service.endedCallback === 'function') {
        service.$apply(service.endedCallback());
      }
    };

    var onReadyFunc = function(event) {
      service.player.playVideo();
    }

    var onStateChangeFunc = function(event) {
      if (event.data == YT.PlayerState.ENDED) {
        service.performEndedCallback();
      }
    };

    var onErrorFunc = function(event) {
      service.performEndedCallback();
    }

    return service;
  }]);

ptServices.service('QueueService', ['$rootScope', 'YTPlayerService',
  function ($rootScope, YTPlayerService) {
    var service = $rootScope.$new(true);

    service.queue = [];

    service.add = function(video) {
      if(!YTPlayerService.current) {
        YTPlayerService.play(video);
      } else {
        service.queue.push(video);
      }
    };

    service.playNext = function() {
      if(service.queue.length > 0) {
        YTPlayerService.play(service.queue.shift());
      } else {
        YTPlayerService.clear();
      }
    };

    YTPlayerService.endedCallback = service.playNext;

    return service;
  }]);
