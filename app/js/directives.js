'use strict';

/* Directives */

var ptDirectives = angular.module('partytube.directives', ['partytube.services']);

ptDirectives.directive('youtubePlayer', ['YTPlayerService',
  function (YTPlayerService) {
    return {
      restrict: 'A',
      link: function (scope, element) {
        if(!element[0].id)  element[0].id = "yt_player";
        YTPlayerService.bindVideoPlayer(element[0].id);
      }
    };
  }]);

ptDirectives.directive('scrollEnded', ['$timeout', function($timeout) {
  return function(scope, element, attrs) {
    var handler =  function() {
      if (element[0].scrollTop + element[0].offsetHeight + 200 >= element[0].scrollHeight) {
        if(scope.$$phase) {
          scope.$eval(attrs.scrollEnded);
        } else {
          scope.$apply(attrs.scrollEnded);
        }
      }
    };

    element.bind('scroll', handler);
    scope.$on('results_changed', function() {
      handler();
    });

    scope.$on('$destroy', function() {
      element.unbind('scroll');
    });
  };
}]);
