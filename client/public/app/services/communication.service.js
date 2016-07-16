(function(){
	'use strict';

	angular.module('services')
	.service('Communication', ['$http', '$q', '$state', 'Config', 'Auth', 'Load', CommunicationService]);

	function CommunicationService($http, $q, $state, Config, Auth, Load){
		function common(path, method, queryParams, body){
			var deferred = $q.defer();
			var headers = {'Content-Type': 'application/json'};
			var token = Auth.getToken();
			if(token) headers['Authorization'] = "Bearer " + token;

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
				if(error.status === 401){
					Auth.setToken('');
					$state.transitionTo('user-login', {
						transitionMessage: "Your session has expired. Please log in again."
					});
				}
				deferred.reject(error);
			})
			.finally(Load.stopLoading);
			return deferred.promise;
		}

		function startLoading(){
			Load.startLoading();
		}

		function stopLoading(){
			Load.stopLoading();
		}

		return {
			startLoading: startLoading,
			stopLoading: stopLoading,
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
