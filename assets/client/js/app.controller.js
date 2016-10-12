(function(){
	'use strict';

	angular.module('app')
	.controller('app-control', ['SearchMenu', appController]);

	function appController(SearchMenu){
		var rvm = this;
		rvm.SearchMenu = SearchMenu;
	}
})();