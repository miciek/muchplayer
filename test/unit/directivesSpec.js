'use strict';

/* jasmine specs for directives go here */

describe('directives', function() {

  beforeEach(module('partytube.services'));
  beforeEach(module('partytube.directives'));

  describe('youtube player directive', function () {
    it('should bind the DOM element for Youtube player to the service', inject(function ($compile, $rootScope, YTPlayerService) {
      $compile('<div youtube-player></div>')($rootScope);
      expect(YTPlayerService.playerId).not.toEqual(null);
    }));
  });

});
