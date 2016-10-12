(function(){
	'use strict';

	angular.module('app')
	.controller('app-control', ['SearchMenu', appController]);

	function appController(SearchMenu){
		var rvm = this;
		rvm.SearchMenu = SearchMenu;
		/*rvm.isLoading = false;

		rvm.startLoading = function(){
			rvm.isLoading = true;
		}

		rvm.stopLoading = function(){
			rvm.isLoading = false;
		}*/
	}
})();