'use strict';

/* Resources */

var ptResources = angular.module('partytube.resources', ['ngResource']);

ptResources.factory('YTSearchResult', ['$resource',
  function($resource){
    return $resource('https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=:q&key=AIzaSyAjYBy_o8ahk-ckWEzDIMCqIqdaswwPRAs');
  }]);
