(function(){
	'use strict';

	angular.module('services')
	.service('Auth', ['$window', AuthService]);

	function AuthService($window){
		
		function setToken(token){
			$window.localStorage.accessToken = token;
		}	

		function getToken(){
			return $window.localStorage.accessToken;
		}

		function isLoggedIn(){
			var token = getToken();
			return (token && typeof token === 'string' && token.length > 0) || false;
		}

		return {
			getToken: getToken,
			setToken: setToken,
			isLoggedIn: isLoggedIn
		};
	}
})();
