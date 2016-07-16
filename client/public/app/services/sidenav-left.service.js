(function(){
	'use strict';

	angular.module('services')
	.service('sidenavLeft', ['$mdSidenav', '$mdComponentRegistry', '$state', 'Auth', SidenavLeftService]);

	function SidenavLeftService($mdSidenav, $mdComponentRegistry, $state, Auth){
		// var loggedIn = false;

		function isLoggedIn(){
			var woop = Auth.isLoggedIn();
			return woop;
		}

		function toggle(){
			if($mdComponentRegistry.get('right') && $mdSidenav('right').isOpen() && !$mdSidenav('left').isOpen()){
				$mdSidenav('right').close()
				.then(function(){
					$mdSidenav('left').open();
				})
			}
			else{
				$mdSidenav('left').toggle();				
			}
		}

		function goToHome(){
			$state.transitionTo('index');
		}

		function goToMessages(){
			$state.transitionTo('message-list');
		}

		function goToContact(){
			$state.transitionTo('contact');
		}

		function goToAbout(){
			$state.transitionTo('about');
		}

		function goToDonate(){
			$state.transitionTo('donate-detail');
		}

		function goToDedication(){
			$state.transitionTo('dedication-list');
		}

		function goToProfile(){
			$state.transitionTo('user-detail');
		}

		function goToFeedback(){
			$state.transitionTo('feedback-submit');
		}

		function goToEdit(){
			$state.transitionTo('user-edit');
		}

		function goToSupportGroups(){
			$state.transitionTo('support-group-list');
		}

		function goToUserCreate(){
			$state.transitionTo('user-create');
		}

		function goToLogin(){
			$state.transitionTo('user-login');
		}

		function logout(){
			Auth.setToken('');
			$state.transitionTo('user-login', {
				transitionMessage: "You have been logged out."
			});
		}

		return {
			// loggedIn: loggedIn,
			isLoggedIn: isLoggedIn,
			// setState: setState,
			toggle: toggle,
			goToUserCreate: goToUserCreate,
			goToLogin: goToLogin,
			goToFeedback: goToFeedback,
			goToEdit: goToEdit,
			goToAbout: goToAbout,
			goToDedication: goToDedication,
			goToDonate: goToDonate,
			goToContact: goToContact,
			goToMessages: goToMessages,
			goToHome: goToHome,
			goToProfile: goToProfile,
			goToSupportGroups: goToSupportGroups,
			logout: logout
		};
	}
})();
