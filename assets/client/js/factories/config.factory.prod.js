(function(){
	'use strict';

	angular.module('factories')
	.factory('Config', [ConfigFactory]);

	function ConfigFactory(){
		var config = {
			serverURL: 'http://wooted.info/'
		};
		return config;
	}
})();