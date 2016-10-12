'use strict';

/* Filters */

angular.module('app')
.filter('interpolate', function (version) {
	return function (text) {
		return String(text).replace(/\%VERSION\%/mg, version);
	};
})
.filter('reverse', function() {
	return function(items) {
		return items ? items.slice().reverse() : [];
	};
})
.filter('html', function($sce) {
	return function(val) {
		return $sce.trustAsHtml(val);
	};
});;
