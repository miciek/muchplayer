'use strict';

/* Controllers */

var ptControllers = angular.module('partytube.controllers', ['partytube.services']);

ptControllers.controller('SearchCtrl', ['$scope', '$timeout', 'YTSearchResult', 'YTPlayerService',
  function($scope, $timeout, YTSearchResult, YTPlayerService) {
    $scope.youtubePlayer = YTPlayerService;

    $scope.searchCount = 0;
    $scope.search = function() {
      if($scope.query) {
        $scope.result = YTSearchResult.get({ q: $scope.query });
        $scope.searchCount += 1;
      } else {
        $scope.result = { items : [] };
      }
    };

    $scope.searchAfterTimeout = function(timeout) {
      timeout = timeout || 500;
      $timeout.cancel(this.searchTimeout);
      this.searchTimeout = $timeout(this.search, timeout);
    };

  }]);
