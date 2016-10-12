(function(){
	'use strict';

	angular.module('factories')
	.factory('Config', [ConfigFactory]);

	function ConfigFactory(){
		var config = {
			serverURL: 'http://localhost:9001/'
			// serverURL: 'https://dev.ineedtotalk.org/'
			// serverURL: 'http://ineedtotalk.org:9001/'
		};
		return config;
	}
})();