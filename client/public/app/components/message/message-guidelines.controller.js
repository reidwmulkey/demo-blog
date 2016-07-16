(function(){
	'use strict';

	angular.module('message')
	.controller('message-guidelines', ['$state', 'sidenavLeft', 'User', MessageGuidelines]);

	function MessageGuidelines($state, sidenavLeft, User){
		var vm = this;
		vm.sidenavLeft = sidenavLeft;
		
		//variables
		vm.userAgreed = false;
		
		//functions		
		vm.okay = okay;
		
		//implementation
		function okay(){
			if(vm.userAgreed){
				User.acceptGuidelines()
				.then(function(){
					$state.transitionTo('message-list');
				})
				.catch(console.error);
			}
		}
	}
})();