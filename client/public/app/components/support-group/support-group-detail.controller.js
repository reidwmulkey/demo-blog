(function(){
	'use strict';

	angular.module('support-group')
	.controller('support-group-detail', ['$mdToast', '$state', '$scope', '$compile', '$stateParams', 'sidenavLeft', 'SupportGroup', 'Auth', '$mdDialog', SupportGroupDetail]);

	function SupportGroupDetail($mdToast, $state, $scope, $compile, $stateParams, sidenavLeft, SupportGroup, Auth, $mdDialog){
		//variables
		var vm = this;
		vm.sidenavLeft = sidenavLeft;
		vm.tabContent = "";
		vm.supportGroupUrl = $stateParams.supportGroupUrl;
		vm.supportGroupId;
		vm.topHalfHeight;
		vm.toolbarHeight;

		//functions
		vm.getSupportGroup = getSupportGroup;
		vm.joinSupportGroup = joinSupportGroup;
		vm.moreInfo = moreInfo;

		//implementation

		//watch stuff

		$scope.$watch('vm.topHalfHeight', tabHeight);

		$scope.$watch('vm.toolbarHeight', tabHeight);

		//adjust stuff
		function tabHeight(){
			vm.tabHeight = 'calc(100vh - ' + (vm.topHalfHeight + vm.toolbarHeight) + 'px)';
		}

		function joinSupportGroup(){
			console.log(Auth.isLoggedIn());
			console.log(Auth.getToken());
			if(Auth.isLoggedIn()){
				SupportGroup.join(vm.supportGroupId)
				.then(function(){
					var promise = $mdToast.show($mdToast.simple().textContent("Joined Support Group. Go to messages?").action("Yes"));
					promise.then(function(result){
						if(result === 'ok')
							$state.transitionTo('message-list');
					});				
				})
				.catch(function(err){
					$mdToast.show($mdToast.simple().textContent(err.data));
				});
			}
			else {
				$mdToast.show($mdToast.simple().textContent('You must log in to join a support group.'));
			}
		}

		function getSupportGroup(){
			SupportGroup.get(null, vm.supportGroupUrl)
			.then(function(supportGroup){
				setTimeout(function(){
					vm.supportGroup = supportGroup;
					vm.supportGroupId = vm.supportGroup._id;
					var tabContent = $compile(vm.supportGroup.details)($scope);
					angular.element(document.getElementById('tabContent')).append(tabContent);
					$scope.$apply();
				}, 0);
			})
			.catch(function(err){
				$mdToast.show($mdToast.simple().textContent(err.data));
			});
		}

		function moreInfo(ev){
			$mdDialog.show({
				controller: ['$scope', '$mdDialog', 'supportGroup', InfoCtrl],
				templateUrl: '/app/support-group/dialog/more-info.jade',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:true,
				fullscreen: false,
				locals: {
					supportGroup: vm.supportGroup
				}
			})

			function InfoCtrl($scope, $mdDialog, supportGroup){
				$scope.supportGroup = supportGroup;

				$scope.close = function(){
					$mdDialog.hide();
				}
			}
		}

		vm.getSupportGroup();
	}
})();