(function(){
	'use strict';

	angular.module('information')
	.controller('about-ctrl', ['sidenavLeft', AboutCtrl]);

	function AboutCtrl(sidenavLeft){
		var vm = this;
		vm.sidenavLeft = sidenavLeft;
	}
})();