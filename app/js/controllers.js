'use strict';

/* Controllers */

var ptControllers = angular.module('partytube.controllers', []);

ptControllers.controller('SearchCtrl', ['$scope', 'YTSearchResult', function($scope, YTSearchResult) {
  $scope.search = function() {
    $scope.results = YTSearchResult.get({ q: $scope.query });
    $scope.count = $scope.count + 1;
  };
  $scope.count = 0;
}]);
