(function(){
	'use strict';

	angular.module('app')
	.controller('index-ctrl', ['$state', '$scope', 'Wooted', indexCtrl]);

	function indexCtrl($state, $scope, Wooted){
		var vm = this;
		vm.items;

		console.log('loaded index.controller.js');
		Wooted.getAllWoots()
		.then(function(items){
			vm.items = items;
			console.log(vm.items);
		})
		.catch(function(error){
			vm.items = [];
			console.log(error);
		});
	}
})();