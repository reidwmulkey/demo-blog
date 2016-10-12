(function(){
	'use strict';

	angular.module('services')
	.service('SearchMenu', ['$mdSidenav', '$mdComponentRegistry', '$state', SearchMenu]);

	function SearchMenu($mdSidenav, $mdComponentRegistry, $state){
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
			toggle: toggle
		};
	}
})();
