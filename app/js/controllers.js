'use strict';

/* Controllers */

var ptControllers = angular.module('partytube.controllers', []);

ptControllers.controller('SearchCtrl', ['$scope', 'YTSearchResult', '$timeout', function($scope, YTSearchResult, $timeout) {
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
    $timeout.cancel(this.searchTimeout);
    this.searchTimeout = $timeout($scope.search, timeout);
  };
}]);
