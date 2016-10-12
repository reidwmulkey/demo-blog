(function(){
	'use strict';

	angular.module('services')
	.service('Wooted', ['$http', '$q', '$state', 'Communication', WootedService]);

	function WootedService($http, $q, $state, Communication){
		function getAllWoots(){
			return Communication.get('api/items');
		}

		return {
			getAllWoots: getAllWoots
		};
	}
})();
