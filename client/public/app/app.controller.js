(function(){
	'use strict';

	angular.module('app')
	.controller('app-control', ['$rootScope', '$mdDialog', 'ELock', 'Load', appController]);

	function appController($rootScope, $mdDialog, ELock, Load){
		var rvm = this;
		rvm.ELock = ELock;
		rvm.Load = Load;

		$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
			if(angular.element(document).find('md-dialog').length > 0) 
				$mdDialog.cancel();
			var position = 'bottom';
			if(rvm.ELock.positions.top.indexOf(toState.name) !== -1)
				position = 'top';
			rvm.ELock.position(position);
		});
	}
})();