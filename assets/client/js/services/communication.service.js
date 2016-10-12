(function(){
	'use strict';

	angular.module('services')
	.service('Communication', ['$http', '$q', '$state', 'Config', 'Load', CommunicationService]);

	function CommunicationService($http, $q, $state, Config, Load){
		function common(path, method, queryParams, body){
			var deferred = $q.defer();
			var headers = {'Content-Type': 'application/json'};
		
			var req = {
				method: method,
				url: Config.serverURL + path,
				headers: headers,
				params: queryParams ? queryParams : null
			};
			
			if((method != 'GET') && body)
				req.data = body;
			Load.startLoading();

			$http(req).then(function(resp){
				deferred.resolve(resp.data);
			})
			.catch(function(error){
				deferred.reject(error);
			})
			.finally(Load.stopLoading);
			return deferred.promise;
		}

		return {
			get: function(path, queryParams){
				return common(path, 'GET', queryParams, null);	
			},
			put: function(path, body){
				return common(path, 'PUT', null, body);	
			},
			post: function(path, body){
				return common(path, 'POST', null, body);	
			},
		};
	}
})();
