(function(){
	'use strict';

	angular.module('feedback')
	.controller('feedback-submit', ['$scope', '$window', '$mdDialog', '$mdToast', 'sidenavLeft', 'Feedback', FeedbackSubmit]);

	function FeedbackSubmit($scope, $window, $mdDialog, $mdToast, sidenavLeft, Feedback){
		var vm = this;
		vm.sidenavLeft = sidenavLeft;
		vm.features;
		vm.comment = "";
		vm.additionalFeatures = "";
		vm.additionalSupportGroups = "";

		//functions
		vm.sendFeedback = sendFeedback;
		vm.getAllFeatures = getAllFeatures;
		vm.showInfo = showInfo;

		//implementation
		function showInfo(feature, ev){
			$mdDialog.show({
				controller: FeatureInfo,
				templateUrl: 'app/feedback/dialog/feature-info.jade',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:true,
				fullscreen: false,
				locals: {
					description: feature.description,
					info: feature.info
				}
			});
			function FeatureInfo($scope, $mdDialog, description, info){
				$scope.description = description;
				$scope.info = info;

				$scope.cancel = function(){
					$mdDialog.cancel();
				}

				$scope.okay = function(){
					$mdDialog.hide();
				}
			}
		}

		function getVotes(){
			var votes = [];
			for(var i = 0; i < vm.features.length; i++){
				votes.push({
					feature: vm.features[i]._id,
					score: parseInt(vm.features[i].vote)
				});
			}
			return votes;
		}

		function sendFeedback(){
			console.log(getVotes());
			Feedback.sendFeedback(getVotes(), vm.additionalFeatures, vm.additionalSupportGroups, vm.comment)
			.then(function(data){
				$mdDialog.show({
					controller: FeedbackThankyou,
					templateUrl: '/app/feedback/dialog/feedback-thankyou.jade',
					parent: angular.element(document.body),
					clickOutsideToClose:true,
					fullscreen: false
				});

				function FeedbackThankyou($scope, $mdDialog){
					$scope.okay = function(){
						$mdDialog.hide();
						$window.history.back();
					}
				}
			})
			.catch(function(err){
				$mdToast.show($mdToast.simple().textContent(err.data));
			});
		}

		function getAllFeatures(){
			Feedback.getAllFeatures()
			.then(function(features){
				vm.features = features;
				for(var i = 0; i < vm.features.length; i++)
					vm.features[i].vote = null;
			})
			.catch(console.error);
		}

		vm.getAllFeatures();
	}
})();