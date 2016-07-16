(function(){
	'use strict';

	angular.module('user')
	.controller('user-detail', ['$q', '$stateParams', 'sidenavLeft', 'User', userDetail]);

	function userDetail($q, $stateParams, sidenavLeft, User){
		var vm = this;

		//variables
		vm.user = {};
		vm.sidenavLeft = sidenavLeft;
		vm.username = $stateParams.username;
		
		//functions		
		vm.getUser = getUser;
		
		//implementation
		function getUser(){
			User.getByUsername(vm.username)
			.then(function(user){
				vm.user = user;
				console.log(vm.user);
			})
			.catch(console.error);
		}

		vm.getUser();
	}
})();