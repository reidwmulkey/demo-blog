(function(){
	'use strict';

	angular.module('information')
	.controller('contact-ctrl', ['sidenavLeft', ContactCtrl]);

	function ContactCtrl(sidenavLeft){
		var vm = this;
		vm.sidenavLeft = sidenavLeft;
	}
})();