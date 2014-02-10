'use strict';

/* jasmine specs for services */

describe('service', function() {
  beforeEach(module('partytube.services'));

  describe('QueueService', function() {
    var videos;

    beforeEach(function() {
      videos = [];
      for(var i = 0; i < 10; i++) {
        videos[i] = { id : 'test' + i, title : 'title' + i };
      }
    });

    it('is initiated with empty queue', inject(function(QueueService) {
      expect(QueueService.queue).toEqual([]);
    }));

    it('allows adding videos to the queue', inject(function(QueueService) {
      for(var i = 0; i < 10; i++) {
        QueueService.add(videos[i]);
        expect(QueueService.queue.length).toBe(i + 1);
        expect(QueueService.queue[i]).toBe(videos[i]);
      }
    }));

    it('removes first video from the queue after call to popNext', inject(function(QueueService) {
      QueueService.add(videos[0]);
      QueueService.add(videos[1]);
      QueueService.popNext();
      expect(QueueService.queue.length).toBe(1);
      expect(QueueService.queue[0]).toBe(videos[1]);
    }));

    it('does not throw anything when popNext is called on empty queue', inject(function(QueueService) {
      expect(QueueService.popNext).not.toThrow();
      expect(QueueService.queue.length).toBe(0);
    }));
  });

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

    describe('video playing module', function() {
      var video = { id: 'test', title: 'title' };

      it('should work only when API is ready and player is binded', inject(function (YTPlayerService) {
        spyOn(YTPlayerService, 'createPlayer').andReturn({});

        // API not ready, player not binded
        expect(YTPlayerService.ready).toBe(false);
        expect(YTPlayerService.playerId).toBeNull();
        expect(YTPlayerService.player).toBeNull();

        YTPlayerService.play(video);
        expect(YTPlayerService.player).toBeNull();

        // Player binded
        YTPlayerService.playerId = 'ytplayer';
        YTPlayerService.play(video);
        expect(YTPlayerService.player).toBeNull();
        expect(YTPlayerService.createPlayer).not.toHaveBeenCalled();

        // API ready
        YTPlayerService.ready = true;
        YTPlayerService.play(video);
        expect(YTPlayerService.player).not.toBeNull();
        expect(YTPlayerService.createPlayer).toHaveBeenCalled();
      }));

      var PlayerState = { UNSTARTED: -1, ENDED: 0, PLAYING: 1, PAUSED: 2 };
      var event = { data : PlayerState.UNSTARTED };
      var initService = function(service) {
        spyOn(service, 'createPlayer').andReturn({
          playVideo : function() {},
          stopVideo : function() {},
          loadVideoById : function(videoId) {}
        });
        service.playerId = 'ytplayer';
        service.ready = true;
      };

      it('has internal player which is created just before first video is started', inject(function (YTPlayerService) {
        initService(YTPlayerService);
        expect(YTPlayerService.player).toBeNull();

        YTPlayerService.play(video);
        expect(YTPlayerService.player).not.toBeNull();
      }));

      it('should call endedCallback after a video has ended', inject(function (YTPlayerService) {
        initService(YTPlayerService);
        YTPlayerService.play(video);

        YTPlayerService.mocked$$onStateChange = function(event) {
          var YT = { PlayerState: PlayerState };
          this.$$onStateChange(event);
        };

        spyOn(YTPlayerService, 'endedCallback');

        event.data = PlayerState.UNSTARTED;
        YTPlayerService.mocked$$onStateChange(event);
        expect(YTPlayerService.endedCallback).not.toHaveBeenCalled();

        event.data = PlayerState.ENDED;
        YTPlayerService.mocked$$onStateChange(event);
        expect(YTPlayerService.endedCallback).toHaveBeenCalled();
      }));

      it('should call endedCallback when video is in error state', inject(function (YTPlayerService) {
        initService(YTPlayerService);

        spyOn(YTPlayerService, 'endedCallback');

        YTPlayerService.play(video);
        expect(YTPlayerService.endedCallback).not.toHaveBeenCalled();

        YTPlayerService.$$onError(event);
        expect(YTPlayerService.endedCallback).toHaveBeenCalled();
      }));

      it('should call player.playVideo when ready to be played', inject(function (YTPlayerService) {
        initService(YTPlayerService);
        YTPlayerService.play(video);
        spyOn(YTPlayerService.player, 'playVideo');

        YTPlayerService.$$onReady(event);
        expect(YTPlayerService.player.playVideo).toHaveBeenCalled();
      }));

      it('can be cleared any time, i.e. video stops and state resets', inject(function (YTPlayerService) {
        initService(YTPlayerService);
        expect(YTPlayerService.current).toBeNull();

        YTPlayerService.play(video);
        expect(YTPlayerService.current).toEqual(video);
        spyOn(YTPlayerService.player, 'stopVideo');

        YTPlayerService.clear();
        expect(YTPlayerService.player.stopVideo).toHaveBeenCalled();
        expect(YTPlayerService.current).toBeNull();
      }));

      it('reuses already created internal player to play subsequent videos', inject(function(YTPlayerService) {
        initService(YTPlayerService);
        YTPlayerService.play(video);
        expect(YTPlayerService.createPlayer.calls.length).toBe(1);
        spyOn(YTPlayerService.player, 'loadVideoById');

        for(var i = 1; i <= 5; i++) {
          var v = { id : 'test' + i, title : 'title' + i };
          YTPlayerService.play(v);
          expect(YTPlayerService.createPlayer.calls.length).toBe(1);
          expect(YTPlayerService.player.loadVideoById.calls.length).toBe(i);
          expect(YTPlayerService.player.loadVideoById).toHaveBeenCalledWith(v.id);
          expect(YTPlayerService.current).toBe(v);
        }
      }));
    });
  });
});
