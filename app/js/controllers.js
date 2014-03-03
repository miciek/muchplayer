'use strict';

/* Controllers */

var ptControllers = angular.module('partytube.controllers', ['partytube.services', 'partytube.resources']);

ptControllers.controller('SearchCtrl', ['$scope', '$timeout', 'YTSearchResult', 'QueueService', 'YTPlayerService', 'LayoutService',
  function($scope, $timeout, YTSearchResult, QueueService, YTPlayerService, LayoutService) {
    $scope.layout = LayoutService;
    $scope.queue = QueueService.queue;
    $scope.player = YTPlayerService;

    $scope.searchTimeout = null;
    $scope.searchAfterTimeout = function(timeout) {
      timeout = timeout || 500;
      $timeout.cancel(this.searchTimeout);
      this.searchTimeout = $timeout(function() {
        if($scope.query) {
          $scope.result = YTSearchResult.get({ q: $scope.query });
        } else {
          $scope.result = { items : [] };
        }
      }, timeout);
    };

    $scope.addToQueue = function(searchItem) {
      var video = {
        id: searchItem.id.videoId,
        title: searchItem.snippet.title,
        img: searchItem.snippet.thumbnails.default.url
      };

      if(!YTPlayerService.current) {
        YTPlayerService.play(video);
      } else {
        QueueService.add(video);
      }

      resize();
    };
  }]);

ptControllers.controller('QueueCtrl', ['$scope', 'QueueService', 'YTPlayerService', 'LayoutService',
  function($scope, QueueService, YTPlayerService, LayoutService) {
    $scope.layout = LayoutService;
    $scope.queue = QueueService.queue;
    $scope.player = YTPlayerService;

    $scope.skip = function() {
      var next = QueueService.popNext();
      if(next) {
        YTPlayerService.play(next);
      } else {
        YTPlayerService.clear();
      }
    };

    $scope.skipAndPlayLater = function() {
      var toBeAdded = YTPlayerService.current;
      if(toBeAdded !== null && toBeAdded !== undefined) {
        $scope.skip();
        QueueService.add(toBeAdded);
      }
    };

    $scope.player.endedCallback = $scope.skip;
  }]);
