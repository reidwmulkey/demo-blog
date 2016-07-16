(function(){
	'use strict';

	angular.module('support-group')
	.controller('support-group-list', ['$mdToast', '$state', '$scope', 'sidenavLeft', 'SupportGroup', SupportGroupList]);

	function SupportGroupList($mdToast, $state, $scope, sidenavLeft, SupportGroup){
		//variables
		var vm = this;
		vm.sidenavLeft = sidenavLeft;
		vm.supportGroups = [];

		//functions
		vm.getAllSupportGroups = getAllSupportGroups;
		vm.goToDetail = goToDetail;

		//implementation

		function goToDetail(supportGroup){
			$state.transitionTo('support-group-detail', {
				supportGroupUrl: supportGroup.url
			});
		}

		function getAllSupportGroups(){
			SupportGroup.getAll()
			.then(function(supportGroups){
				console.log(supportGroups);
				vm.supportGroups = supportGroups;
			})
			.catch(function(err){
				$mdToast.show($mdToast.simple().textContent(err.data));
			});
		}

		vm.getAllSupportGroups();
	}
})();