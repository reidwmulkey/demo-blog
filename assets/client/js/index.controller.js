(function(){
	'use strict';

	angular.module('app')
	.controller('index-ctrl', ['$state', '$scope', '$mdDialog', '$mdToast', 'Wooted', 'SearchMenu', indexCtrl]);

	function indexCtrl($state, $scope, $mdDialog, $mdToast, Wooted, SearchMenu){
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
				// console.log(vm.items);
			})
			.catch(function(error){
				// console.error(error);
				$mdToast.show($mdToast.simple().textContent(error.data));
			})
		}

		vm.selectItem = function(item){
			$mdDialog.show({
				controller: ['$scope', '$mdDialog', 'Wooted', ItemDetailCtrl],
				templateUrl: '/assets/client/views/app/item-detail.html',
				parent: angular.element(document.body),
				clickOutsideToClose:true,
				fullscreen: false,
				locals: {
					item: item
				}
			})

			function ItemDetailCtrl($scope, $mdDialog, Wooted){
				$scope.item = item;
				console.log($scope.item);

				Wooted.getItem($scope.item._id)
				.then(function(item){
					$scope.item = item;
					if($scope.item.instances.length > 0)
						$scope.item.lastSold = $scope.item.instances[0].date;
					var averagePrice = 0;
					for(var i = 0; i < $scope.item.instances.length; i++){
						var price = $scope.item.instances[i].price;
						price = price.split('$').join('');
						if(price.indexOf('-') !== -1){
							//price range - take average price of the range and add to average price
							var priceArray = price.split('-');
							var p1 = parseFloat(priceArray[1]);
							var p0 = parseFloat(priceArray[0]);
							var midRangePrice = ((p1 - p0) / 2) + p0;
							averagePrice += midRangePrice;
							console.log(midRangePrice);
						}
						else {
							//just a dollar amount
							averagePrice += parseFloat(price);
						}
					}
					$scope.item.averagePrice = roundToDollarAmount(averagePrice / $scope.item.instances.length);
					console.log($scope.item);
				}).catch(function(error){
					$mdToast.show($mdToast.simple().textContent(error.data));
				});

				$scope.close = function(){
					$mdDialog.hide();
				}

				//http://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-in-javascript
				function roundToDollarAmount(num){
					return +(Math.round(num + "e+2")  + "e-2");
				}
			}
		}

		console.log('loaded index.controller.js');
	}
})();