(function(){
	'use strict';

	angular.module('app')
	.controller('index-ctrl', ['$state', '$scope', '$mdDialog', 'Wooted', 'SearchMenu', indexCtrl]);

	function indexCtrl($state, $scope, $mdDialog, Wooted, SearchMenu){
		var vm = this;
		vm.items;
		vm.selectSpecificSites = false;
		vm.availableSites = [
			{ name:'woot', url:'http://www.woot.com' }, 
			{ name:'electronics', url:'http://electronics.woot.com' }, 
			{ name:'home', url:'http://home.woot.com' }, 
			{ name:'tools & garden', url:'http://tools.woot.com' }, 
			{ name:'sport', url:'http://sport.woot.com' }, 
			{ name:'accessories & watches', url:'http://accessories.woot.com' }, 
			{ name:'wine', url:'http://wine.woot.com' }
		];
		vm.selectedSites = [];
		vm.itemName = '';

		vm.selectSite = function(site) {
			var index = vm.selectedSites.indexOf(site.name);
		    if(index > -1) 
		      vm.selectedSites.splice(index, 1);
		    else 
		      vm.selectedSites.push(site.name);
		}

		vm.search = function(){
			Wooted.search(vm.itemName, vm.selectedSites.length > 0 ? vm.selectedSites : null)
			.then(function(items){
				vm.items = items;
				SearchMenu.toggle();
				console.log(vm.items);
			})
			.catch(function(error){
				$mdToast.show($mdToast.simple().textContent(error.data));
			})
		}

		vm.selectItem = function(item){
			$mdDialog.show({
				controller: ['$scope', '$mdDialog', 'Wooted', ItemDetailCtrl],
				templateUrl: '/assets/client/views/app/item-detail.html',
				parent: angular.element(document.body),
				// targetEvent: event,
				clickOutsideToClose:true,
				fullscreen: false,
				locals: {
					item: item
				}
			})

			function ItemDetailCtrl($scope, $mdDialog, Wooted){
				$scope.item = item;
				console.log($scope.item);

				$scope.close = function(){
					$mdDialog.hide();
				}
			}
		}

		console.log('loaded index.controller.js');
		// Wooted.getAllWoots()
		// .then(function(items){
		// 	vm.items = items;
		// 	console.log(vm.items);
		// })
		// .catch(function(error){
		// 	vm.items = [];
		// 	console.log(error);
		// });
	}
})();