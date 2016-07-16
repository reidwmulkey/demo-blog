(function(){
	'use strict';

	angular.module('dedication')
	.controller('dedication-list', ['$q','$scope', '$mdDialog', '$mdToast', '$mdComponentRegistry', '$mdSidenav', '$stateParams', 'sidenavLeft', 'Dedication', DedicationList]);

	function DedicationList($q, $scope, $mdDialog, $mdToast, $mdComponentRegistry, $mdSidenav, $stateParams, sidenavLeft, Dedication){
		//variables
		var vm = this;
		vm.sidenavLeft = sidenavLeft;
		vm.dedications;
		vm.searchText = '';
		vm.lastSearchText = '';

		//functions
		vm.getDedications = getDedications;
		vm.sidenavRightButtonClicked = sidenavRightButtonClicked;
		vm.keyPressed = keyPressed;
		vm.search = search;
		//implementation

		function keyPressed(keyEvent){
			if (keyEvent.which === 13){
				vm.search();
			}	
		}

		function sidenavRightButtonClicked(){
			if($mdComponentRegistry.get('left') && $mdSidenav('left').isOpen() && !$mdSidenav('right').isOpen()){
				$mdSidenav('left').close()
				.then(function(){
					$mdSidenav('right').open();
				})
			}
			else{
				$mdSidenav('right').toggle();				
			}
		}

		function search(){
			Dedication.search(vm.searchText)
			.then(function(dedications){
				console.log(dedications);
				vm.lastSearchText = vm.searchText;
				vm.dedications = dedications;
			})
			.catch(function(err){
				console.error(err);
				$mdToast.show($mdToast.simple().textContent(err.data));
			})
		}

		function getDedications(){
			Dedication.getAll()
			.then(function(dedications){
				console.log(dedications);
				vm.dedications = dedications;
			})
			.catch(function(err){
				console.error(err);
				$mdToast.show($mdToast.simple().textContent(err.data));
			});
		}

		vm.getDedications();
	}
})();