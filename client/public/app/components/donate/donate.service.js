(function(){
	'use strict';

	angular.module('donate')
	.service('Donate', ['$q', '$window', 'Communication', DonateService]);

	function DonateService($q, $window, Communication){

		function getDedicationAmount(){
			return Communication.get("api/exposed/dedications/amount");
		}

		return {
			getDedicationAmount: getDedicationAmount
		};
	}
})();