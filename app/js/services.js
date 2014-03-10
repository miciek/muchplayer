'use strict';

/* Services */

var ptServices = angular.module('partytube.services', ['ngResource']);

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

    // config
    service.playerHeight = '390';
    service.playerWidth = '640';
    service.endedCallback = null;
    service.YT = null;

    // state
    service.ready = false;
    service.playerId = null;
    service.player = null;
    service.current = null;

    // YouTube required callback when API is ready
    $window.onYouTubeIframeAPIReady = function () {
      service.ready = true;
    };

    service.bindVideoPlayer = function (elementId) {
      service.playerId = elementId;
    };

    service.createPlayer = function (videoId) {
      service.YT = YT;
      return new YT.Player(this.playerId, {
        height: this.playerHeight,
        width: this.playerWidth,
        videoId: videoId,
        events: {
          'onReady': service.$$onReady,
          'onStateChange': service.$$onStateChange,
          'onError': service.$$onError
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

    service.$$performEndedCallback = function() {
      if(typeof service.endedCallback === 'function') {
        service.$apply(service.endedCallback());
      }
    };

    service.$$onReady = function(event) {
      service.player.playVideo();
    }

    service.$$onStateChange = function(event) {
      if (event.data == service.YT.PlayerState.ENDED) {
        service.$$performEndedCallback();
      }
    };

    service.$$onError = function(event) {
      service.$$performEndedCallback();
    }

    return service;
  }]);

ptServices.service('QueueService', ['$rootScope',
  function ($rootScope) {
    var service = $rootScope.$new(true);

    service.queue = [];

    service.add = function(video) {
      this.queue.push(video);
    };

    service.popNext = function() {
      if(service.queue.length > 0) {
        return this.queue.shift();
      } else {
        return null;
      }
    };

    return service;
  }]);

