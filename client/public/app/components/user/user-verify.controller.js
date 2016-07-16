(function(){
	'use strict';

	angular.module('user')
	.controller('user-verify', ['$state', '$stateParams', '$mdToast', 'User', userVerify]);

	function userVerify($state, $stateParams, $mdToast, User){
		var vm = this;

		//variables
		vm.username = '';
		vm.password = '';
		vm.emailKey = $stateParams.emailKey;

		//functions
		vm.verify = verify;
		vm.keyPressed = keyPressed;

		function keyPressed(keyEvent){
			if (keyEvent.which === 13){
				vm.verify();
			}	
		}

		function verify(){
			User.verify(vm.username, vm.password, vm.emailKey).then(function(){
				$state.transitionTo('user-login', {transitionMessage: "Your email has been verified. Please log in."});
			}).catch(function(err){
				$mdToast.show($mdToast.simple().textContent(err.data));
			});
		}
	}
})();