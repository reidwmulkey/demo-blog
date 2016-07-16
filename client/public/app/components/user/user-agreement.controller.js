(function(){
	'use strict';

	angular.module('user')
	.controller('user-agreement', ['$window', '$state', 'sidenavLeft', UserAgreement]);

	function UserAgreement($window, $state, sidenavLeft){
		var vm = this;
		vm.sidenavLeft = sidenavLeft;
		
		//variables
		vm.userAgreed = false;
		
		//functions		
		vm.okay = okay;
		
		//implementation
		function okay(){
			if(vm.userAgreed){
				$window.sessionStorage.acceptedTerms = true;
				$state.transitionTo('user-create');
			}
		}
	}
})();