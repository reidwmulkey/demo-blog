(function(){
	'use strict';

	angular.module('user')
	.controller('user-login', ['$state', '$stateParams', '$scope', '$mdDialog', '$mdMedia', '$mdToast', 'User', 'sidenavLeft', userLogin]);

	function userLogin($state, $stateParams, $scope, $mdDialog, $mdMedia, $mdToast, User, sidenavLeft){
		//variables
		var vm = this;
		vm.sidenavLeft = sidenavLeft;
		vm.username = '';
		vm.password = '';

		//functions
		vm.login = login;
		vm.showForgotPassword = showForgotPassword;
		vm.keyPressed = keyPressed;

		//implementation
		function keyPressed(keyEvent){
			if (keyEvent.which === 13){
				vm.login();
			}	
		}

		function login(){
			User.login(vm.username, vm.password).then(function(data){
				$state.transitionTo('message-list');
			}).catch(function(err){
				$mdToast.show($mdToast.simple().textContent(err.data));
			});
		}

		function showForgotPassword(ev) {
			var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
			$mdDialog.show({
				controller: UserForgot,
				templateUrl: '/app/user/dialog/user-forgot.jade',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:true,
				fullscreen: false
			})
		};

		function UserForgot($scope, $mdDialog, $mdToast, User){
			$scope.data = {};

			$scope.cancel = function(){
				$mdDialog.cancel();
			}

			$scope.sendEmail = function(){
				var email =  $scope.forgotForm.email.$viewValue;
				User.forgotPassword(email)
				.then(function(){
					$mdToast.show($mdToast.simple().textContent("Successfully reset password."));				
				})
				.catch(function(err){
					$mdToast.show($mdToast.simple().textContent(err.data));
				});
			}
		}

		function checkTransitionMessage(){
			if($stateParams.transitionMessage){
				$mdToast.show($mdToast.simple().textContent($stateParams.transitionMessage));
			}
		}

		checkTransitionMessage();
	}
})();