'use strict';

/* Controllers */

var ptControllers = angular.module('partytube.controllers', ['partytube.services', 'partytube.resources']);

ptControllers.controller('SearchCtrl', ['$scope', '$timeout', 'YTSearchResult', 'QueueService', 'YTPlayerService',
  function($scope, $timeout, YTSearchResult, QueueService, YTPlayerService) {
    $scope.queue = QueueService.queue;
    $scope.player = YTPlayerService;
    $scope.nextPageToken = null;
    $scope.searchTimeout = null;

    $scope.searchAfterTimeout = function(timeout) {
      timeout = timeout || 500;
      $timeout.cancel(this.searchTimeout);
      this.searchTimeout = $timeout(function() {
        if($scope.query) {
          YTSearchResult.get({ q: $scope.query }, function(result) {
            $scope.search_results = result.items;
            $scope.nextPageToken = result.nextPageToken;
            $scope.$emit('data_changed');
          });
        } else {
          $scope.search_results = [];
        }
      }, timeout);
    };

    $scope.addNextPage = function() {
      if($scope.query && $scope.nextPageToken && !$scope.nextPageLoading) {
        $scope.nextPageLoading = true;
        YTSearchResult.get({ q: $scope.query, pageToken: $scope.nextPageToken }, function(result) {
          $scope.nextPageLoading = false;
          $scope.search_results = $scope.search_results.concat(result.items);
          $scope.nextPageToken = result.nextPageToken;
          $scope.$emit('data_changed');
        });
      }
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
    };
  }]);

ptControllers.controller('QueueCtrl', ['$scope', 'QueueService', 'YTPlayerService',
  function($scope, QueueService, YTPlayerService) {
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
