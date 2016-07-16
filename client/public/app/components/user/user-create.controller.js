(function(){
	'use strict';

	angular.module('user')
	.controller('user-create', ['$rootScope', '$q', '$window', '$mdToast', '$state', '$mdDialog', 'User', userCreate]);

	function userCreate($rootScope, $q, $window, $mdToast, $state, $mdDialog, User){
		var vm = this;

		//variables
		vm.username = "";
		vm.email = "";
		vm.password = "";
		vm.passwordConfirm = "";
		vm.subscribedToNewsletter = false;

		//functions
		vm.signup = signup;
		vm.keyPressed = keyPressed;

		//implementation
		// $rootScope.$on('$locationChangeStart', function(event, newURL, oldURL, newState, oldState) {
		// 	// Check if there is a dialog active
		// 	if(angular.element(document).find('md-dialog').length > 0) {
		// 		if(newState !== oldState)
	 //    			$mdDialog.cancel();  // Cancel the active dialog
	 //    	}
	 //    });

function keyPressed(keyEvent){
	if (keyEvent.which === 13){
		vm.signup();
	}	
}

function signup(ev){
	checkPassword().then(function(){
		return User.create(vm.email, vm.username, vm.password, vm.subscribedToNewsletter);
	})
	.then(function(){
		$mdDialog.show({
			controller: UserCreateInfo,
			templateUrl: '/app/user/dialog/user-create-info.jade',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:true,
			fullscreen: false,
			locals: {
				email: vm.email
			}
		});
		function UserCreateInfo($state, $scope, $mdDialog, email){
			$scope.email = email;

			$scope.cancel = function(){
				$mdDialog.cancel();
			}

			$scope.okay = function(){
				$mdDialog.hide();
				$state.transitionTo("user-login");
			}
		}
	}).catch(function(err){
		$mdToast.show($mdToast.simple().textContent(err.data));
	});
}

		//private functions
		function checkPassword(){
			var deferred = $q.defer();
			if(vm.password != vm.passwordConfirm)
				deferred.reject({data:"Password didn't match confirmation."});
			else
				deferred.resolve();
			return deferred.promise;
		}

		function showUserAgreement(){
			// $mdDialog.show({
			// 	controller: UserAgreement,
			// 	templateUrl: '/app/user/dialog/user-agreement.jade',
			// 	// templateUrl: '/app/user/dialog/support-group-guidelines.jade',
			// 	parent: angular.element(document.body),
			// 	clickOutsideToClose:false,
			// 	fullscreen: true
			// });
			// function UserAgreement($scope, $mdDialog){
			// 	$scope.userAgreed = false;
			// 	$scope.okay = function(){
			// 		$mdDialog.hide();
			// 	}
			// }
			$state.transitionTo('user-agreement');
		}
		if(!$window.sessionStorage.acceptedTerms)
			showUserAgreement();
	}
})();