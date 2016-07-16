(function(){
	'use strict';

	angular.module('app')
	.controller('index-ctrl', ['$state', '$scope', 'sidenavLeft', 'ELock', 'Communication', indexCtrl]);

	function indexCtrl($state, $scope, sidenavLeft, ELock, Communication){
		var vm = this;
		vm.isLoaded = false;
		vm.sidenavLeft = sidenavLeft;
		vm.ELock = ELock;
		vm.goToLogin = goToLogin;

		vm.startLoading = function(){
			Communication.startLoading();
		}

		vm.stopLoading = function(){
			Communication.stopLoading();
		}

		// vm.ELock.lock();
		vm.ELock.visible(true);

		var flag = false;
		setInterval(function(){
			vm.ELock.visible(true);
			flag = !flag;
		}, 3000);

		setTimeout(function(){
			vm.isLoaded = true;
			$scope.$apply();
		},0);

		function goToLogin(){
			console.log('going to login.');
			$state.transitionTo('user-login');
		}
	}
})();