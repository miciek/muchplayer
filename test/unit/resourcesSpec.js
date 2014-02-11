'use strict';

/* jasmine specs for resources */

describe('resource', function() {
  beforeEach(module('partytube.resources'));

  describe('YTSearchResult', function () {
    var mockYTSearchResult, $httpBackend;

    beforeEach(function () {
      angular.mock.inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        mockYTSearchResult = $injector.get('YTSearchResult');
      });
    });

    describe('.get', function () {
      it('should return a search result', function () {
        $httpBackend.expectGET('https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=test&key=AIzaSyAjYBy_o8ahk-ckWEzDIMCqIqdaswwPRAs')
          .respond({
            items : [
              {
                id : { videoId : 'testId' },
                snippet : { title : 'testTitle' }
              },
              {
                id : { videoId : 'testId2' },
                snippet : { title : 'testTitle2' }
              }
            ]
          });

        var result = mockYTSearchResult.get({ q: 'test' });
        $httpBackend.flush();

        expect(result.items.length).toBe(2);
        expect(result.items[0].id.videoId).toEqual('testId');
        expect(result.items[0].snippet.title).toEqual('testTitle');
        expect(result.items[1].id.videoId).toEqual('testId2');
        expect(result.items[1].snippet.title).toEqual('testTitle2');
      });
    });
  });
});
