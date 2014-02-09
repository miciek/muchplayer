'use strict';

/* jasmine specs for services go here */

describe('services', function() {
  beforeEach(module('partytube.services'));

  describe('YTPlayerService', function() {
    it('should react to API ready event', inject(function ($window, YTPlayerService) {
      $window.onYouTubeIframeAPIReady();
      expect(YTPlayerService.ready).toBe(true);
    }));

    it('should start with at least minimum dimensions required', inject(function (YTPlayerService) {
      expect(YTPlayerService.playerHeight).toBeGreaterThan('199');
      expect(YTPlayerService.playerWidth).toBeGreaterThan('199');
    }));

    it('should store the player id when binding', inject(function (YTPlayerService) {
      YTPlayerService.bindVideoPlayer('ytplayer');
      expect(YTPlayerService.playerId).toEqual('ytplayer');
    }));

    it('should play video only when API is ready and player is binded', inject(function (YTPlayerService) {
      var video = { id: 'test', title: 'test' };
      spyOn(YTPlayerService, 'createPlayer').andReturn({});

      // API not ready, player not binded
      expect(YTPlayerService.ready).toBe(false);
      expect(YTPlayerService.playerId).toEqual(null);
      expect(YTPlayerService.videoId).toEqual(null);
      expect(YTPlayerService.player).toEqual(null);

      YTPlayerService.play(video);
      expect(YTPlayerService.player).toEqual(null);

      // Player binded
      YTPlayerService.playerId = 'ytplayer';
      YTPlayerService.play(video);
      expect(YTPlayerService.player).toEqual(null);
      expect(YTPlayerService.createPlayer).not.toHaveBeenCalled();

      // API ready
      YTPlayerService.ready = true;
      YTPlayerService.play(video);
      expect(YTPlayerService.player).not.toEqual(null);
      expect(YTPlayerService.createPlayer).toHaveBeenCalled();
    }));
  });
});
