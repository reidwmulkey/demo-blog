(function(){
	'use strict';
	angular.module('donate')
	.controller('donate-detail', ['sidenavLeft', 'Donate', donateDetail]);

	function donateDetail(sidenavLeft, Donate){
		//variables
		var vm = this;
		vm.sidenavLeft = sidenavLeft;
		vm.dedicationAmount;
		vm.dedicationCurrency;

		//implementation
		function getDedicationAmount(){
			Donate.getDedicationAmount()
			.then(function(dedication){
				vm.dedicationAmount = dedication.amount;
				vm.dedicationCurrency = dedication.currency;
			})
			.catch(console.error);
		}

		getDedicationAmount();
	}
})();

