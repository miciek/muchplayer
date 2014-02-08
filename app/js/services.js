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

    // Youtube callback when API is ready
    $window.onYouTubeIframeAPIReady = function () {
      $log.info('Youtube API is ready');
      service.ready = true;
    };

    service.ready = false;
    service.playerId = null;
    service.player = null;
    service.videoId = null;
    service.playerHeight = '390';
    service.playerWidth = '640';

    service.bindVideoPlayer = function (elementId) {
      $log.info('Binding to player ' + elementId);
      service.playerId = elementId;
    };

    service.createPlayer = function (onReady) {
      $log.info('Creating a new Youtube player for DOM id ' + this.playerId + ' and video ' + this.videoId);
      return new YT.Player(this.playerId, {
        height: this.playerHeight,
        width: this.playerWidth,
        videoId: this.videoId,
        events: {
          'onReady': onReady
        }
      });
    };

    service.loadPlayer = function () {
      $log.info('Loading player for playerId ' + this.playerId + ', video ' + this.videoId + ' (' + this.ready + ')');
      // API ready?
      if (this.ready && this.playerId && this.videoId) {
        if(this.player) {
          this.player.destroy();
        }

        this.player = this.createPlayer(function(event) {
          service.player.playVideo();
        });
      }
    };

    service.playVideo = function(id) {
      this.videoId = id;
      this.loadPlayer();
    };

    return service;
  }]);
