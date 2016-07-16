(function(){
	'use strict';

	angular.module('dedication')
	.controller('dedication-detail', ['$q','$scope', '$mdDialog', '$mdToast', '$stateParams', 'sidenavLeft', 'Dedication', DedicationDetail]);

	function DedicationDetail($q, $scope, $mdDialog, $mdToast, $stateParams, sidenavLeft, Dedication){
		//variables
		var vm = this;
		vm.sidenavLeft = sidenavLeft;
		vm.dedicationId = $stateParams.dedicationId;
		vm.dedication;

		//functions
		vm.getDedication = getDedication;
		
		//implementation

		function getDedication(){
			Dedication.getById(vm.dedicationId)
			.then(function(dedication){
				console.log(dedication);
				vm.dedication = dedication;
			})
			.catch(function(err){
				console.error(err);
				$mdToast.show($mdToast.simple().textContent(err.data));
			});
		}

		vm.getDedication();
	}
})();