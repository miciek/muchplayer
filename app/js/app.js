'use strict';

angular.module('partytube', [
  'partytube.controllers',
  'partytube.directives'
]);

// TODO: better jQuery - make jQuery function to handle this

function adjustScrollableListHeight(list, anchor) {
  list.height(($(window).height() - anchor.outerHeight()) + 'px');
}

function adjustQueueHeight() {
  adjustScrollableListHeight($('#queue .list-scrollable'), $('#player'));
}

function adjustSearchResultsHeight() {
  adjustScrollableListHeight($('#search .list-scrollable'), $('#search-form'));
}

$(document).ready(function() {
  adjustQueueHeight();
  adjustSearchResultsHeight();

  $(window).resize(function() {
    adjustQueueHeight();
    adjustSearchResultsHeight();
  });
});

// TODO end
