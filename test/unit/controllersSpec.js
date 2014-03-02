'use strict';

/* jasmine specs for controllers  */

describe('controller', function(){
  beforeEach(module('partytube.controllers'));

  describe('SearchCtrl', function () {
    var $httpBackend, $timeout, scope, ctrl;

    beforeEach(inject(function (_$httpBackend_, _$timeout_) {
      $httpBackend = _$httpBackend_;
      $timeout = _$timeout_;
      $httpBackend.expectGET('https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=test&key=AIzaSyAjYBy_o8ahk-ckWEzDIMCqIqdaswwPRAs')
      .respond({
        items : [
          {
            id : { videoId : 'testId' },
            snippet : { title : 'testTitle', thumbnails : { default : { url: 'testUrl' } } }
          },
          {
            id : { videoId : 'testId2' },
            snippet : { title : 'testTitle2', thumbnails : { default : { url: 'testUrl2' } } }
          }
        ]
      });
    }));

    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('SearchCtrl', { $scope:scope });
    }));


    it('should initate search after the query changes', function () {
      expect(scope.query).toBeUndefined();
      expect(scope.result).toBeUndefined();

      scope.query = 'test';
      scope.searchAfterTimeout();
      expect(scope.result).toBeUndefined();

      $timeout.flush();
      expect(scope.result).not.toBeUndefined();
      expect(scope.result.items).toBeUndefined();

      $httpBackend.flush();
      expect(scope.result.items.length).toBe(2);
      expect(scope.result.items[0].id.videoId).toBe('testId');
      expect(scope.result.items[0].snippet.title).toBe('testTitle');
      expect(scope.result.items[1].id.videoId).toBe('testId2');
      expect(scope.result.items[1].snippet.title).toBe('testTitle2');
    });

    it('should allow adding to the queue if something is playing', inject(function(YTPlayerService, QueueService) {
      spyOn(YTPlayerService, 'play');
      spyOn(YTPlayerService, 'current').andReturn({ id : 'playing' });
      spyOn(QueueService, 'add');

      scope.query = 'test';
      scope.searchAfterTimeout();
      $timeout.flush();
      $httpBackend.flush();

      scope.addToQueue(scope.result.items[0]);
      expect(YTPlayerService.play).not.toHaveBeenCalled();
      expect(QueueService.add).toHaveBeenCalledWith({ id : 'testId', title : 'testTitle', img: 'testUrl' });
    }));

    it('should allow adding to the queue, but starts video instead if nothing is playing', inject(function(YTPlayerService, QueueService) {
      spyOn(YTPlayerService, 'play');
      spyOn(QueueService, 'add');

      scope.query = 'test';
      scope.searchAfterTimeout();
      $timeout.flush();
      $httpBackend.flush();

      scope.addToQueue(scope.result.items[0]);
      expect(YTPlayerService.play).toHaveBeenCalledWith({ id : 'testId', title : 'testTitle', img: 'testUrl' });
      expect(QueueService.add).not.toHaveBeenCalled();
    }));
  });

  describe('QueueCtrl', function() {
    var scope, ctrl;

    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('QueueCtrl', { $scope:scope });
    }));

    it('should integrate with QueueService and YTPlayerService', inject(function(YTPlayerService) {
      expect(scope.queue).toBeDefined();
      expect(YTPlayerService.endedCallback).toBe(scope.skip);
    }));

    it('should call QueueService.popNext when skipped is called', inject(function(QueueService) {
      spyOn(QueueService, 'popNext');
      scope.skip();
      expect(QueueService.popNext).toHaveBeenCalled();
    }));
  });
});
