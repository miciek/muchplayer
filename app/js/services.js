'use strict';

/* Services */

var ptServices = angular.module('partytube.services', ['ngResource']);

ptServices.factory('YTSearchResult', ['$resource',
  function($resource){
    return $resource('https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=:q&key=AIzaSyAjYBy_o8ahk-ckWEzDIMCqIqdaswwPRAs');
  }]);
