'use strict';

/* Resources */

var ptResources = angular.module('partytube.resources', ['ngResource']);

ptResources.factory('YTSearchResult', ['$resource',
  function($resource){
    var defaults = { maxResults: '10' };
    return $resource('https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=:q&maxResults=:maxResults&pageToken=:pageToken&key=AIzaSyAjYBy_o8ahk-ckWEzDIMCqIqdaswwPRAs', defaults);
  }]);
