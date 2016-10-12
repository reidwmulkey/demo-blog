(function(){
	'use strict';

	angular.module('services')
	.service('Wooted', ['$http', '$q', '$state', 'Communication', WootedService]);

	function WootedService($http, $q, $state, Communication){
		function getAllWoots(){
			return Communication.get('api/items');
		}

		function search(itemName, selectedSites){
			return Communication.get('api/items', {
				itemName: itemName,
				selectedSites: selectedSites
			})
		}

		return {
			getAllWoots: getAllWoots,
			search: search
		};
	}
})();
