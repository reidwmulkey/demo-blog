(function(){
	'use strict';

	angular.module('error')
	.controller('error-404', ['sidenavLeft', Error404]);

	function Error404(sidenavLeft){
		var vm = this;
		vm.sidenavLeft = sidenavLeft;
	}
})();