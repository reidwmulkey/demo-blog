(function(){
	'use strict';

	angular.module('services')
	.service('Wooted', ['$http', '$q', '$state', 'Communication', WootedService]);

	function WootedService($http, $q, $state, Communication){
		function getItem(itemId){
			return Communication.get('api/items/detail', {
				itemId: itemId
			});
		}

		function search(itemName, selectedSites){
			return Communication.get('api/items/search', {
				itemName: itemName,
				selectedSites: selectedSites
			})
		}

		return {
			getItem: getItem,
			search: search
		};
	}
})();
