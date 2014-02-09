'use strict';

/* Controllers */

var ptControllers = angular.module('partytube.controllers', ['partytube.services']);

ptControllers.controller('SearchCtrl', ['$scope', '$timeout', 'YTSearchResult', 'QueueService',
  function($scope, $timeout, YTSearchResult, QueueService) {
    $scope.search = function() {
      if($scope.query) {
        $scope.result = YTSearchResult.get({ q: $scope.query });
      } else {
        $scope.result = { items : [] };
      }
    };

    $scope.searchAfterTimeout = function(timeout) {
      timeout = timeout || 500;
      $timeout.cancel(this.searchTimeout);
      this.searchTimeout = $timeout(this.search, timeout);
    };

    $scope.addToQueue = function(searchItem) {
      QueueService.add({
        id: searchItem.id.videoId,
        title: searchItem.snippet.title
      });
    };

  }]);

ptControllers.controller('QueueCtrl', ['$scope', 'QueueService', 'YTPlayerService',
  function($scope, QueueService, YTPlayerService) {
    $scope.queue = QueueService.queue;
    $scope.player = YTPlayerService;

    $scope.skip = function() {
      QueueService.playNext();
    };

    $scope.skipAndPlayLater = function() {
      var toBeAdded = YTPlayerService.current;
      if(toBeAdded !== null && toBeAdded !== undefined) {
        $scope.skip();
        QueueService.add(toBeAdded);
      }
    };
  }]);
