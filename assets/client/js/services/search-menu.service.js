(function(){
	'use strict';

	angular.module('services')
	.service('sidenavLeft', ['$mdSidenav', '$mdComponentRegistry', '$state', SidenavLeftService]);

	function SidenavLeftService($mdSidenav, $mdComponentRegistry, $state){
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

		return {

		};
	}
})();
