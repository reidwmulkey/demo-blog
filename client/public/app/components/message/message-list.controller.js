(function(){
	'use strict';

	angular.module('message')
	.controller('message-list', ['$scope', '$state', '$mdDialog', '$mdBottomSheet', '$mdSidenav', '$mdComponentRegistry', '$anchorScroll', '$window', 'sidenavLeft', 'Message', 'User', 'Auth', messageList]);

	function messageList($scope, $state, $mdDialog, $mdBottomSheet, $mdSidenav, $mdComponentRegistry, $anchorScroll, $window, sidenavLeft, Message, User, Auth){
		//variables
		var vm = this;
		vm.message = "";
		vm.supportGroupName = "";
		vm.user = {};
		vm.selectedSupportGroup = {};
		vm.selectedMessages;
		vm.supportGroupList = [];
		vm.messages = [];
		vm.filter = false;
		vm.isConnected;

		vm.sidenavLeft = sidenavLeft;
		// vm.sidenavRightOpen = true;
		// vm.sidenavLeftOpen = false;

		vm.isScrolledBottom = false;
		vm.messageListHeight;
		vm.toolbarHeight;
		vm.messageBoxHeight;

		//functions
		vm.keyPressed = keyPressed;
		vm.sidenavRightButtonClicked = sidenavRightButtonClicked;
		// vm.sidenavLeftButtonClicked = sidenavLeftButtonClicked;
		vm.sendMessage = sendMessage;
		vm.selectSupportGroup = selectSupportGroup;
		vm.joinSupportGroup = joinSupportGroup;
		vm.leaveSupportGroup = leaveSupportGroup;
		vm.goToProfile = goToProfile;
		vm.userOptions = userOptions;

		//socket.io implementation
		Message.connect(function(){
			vm.isConnected = true;
			console.log('isConnected', vm.isConnected);
			$scope.$apply();
			adjustMessageHeight();
			setTimeout(function(){
				$scope.$apply();
			}, 50);
		}, function(){
			vm.isConnected = false;
			console.log('isConnected', vm.isConnected);
			$scope.$apply();
			adjustMessageHeight();
			setTimeout(function(){
				$scope.$apply();
			}, 50);
		});

		Message.messageLoad(function(loadObject){
			console.log(loadObject);
			vm.selectedSupportGroup = loadObject.user.supportGroups[0] ? loadObject.user.supportGroups[0] : null;
			var supportGroupIdFromStorage = $window.localStorage.selectedSupportGroupId;
			if(supportGroupIdFromStorage) {
				for(var i = 0; i < loadObject.user.supportGroups.length; i++){
					if(loadObject.user.supportGroups[i]._id === supportGroupIdFromStorage){
						vm.selectedSupportGroup = loadObject.user.supportGroups[i];
						break;
					}
				}
			}
			vm.user = loadObject.user;
			console.log(vm.user);
			if(!vm.user.acceptedGuidelines)
				$state.transitionTo('message-guidelines');
			vm.filter = vm.user.profanityFilter;
			vm.messages = loadObject.messages;
			// for(var i = 0; i < vm.user.supportGroups.length; i++){
			// 	console.log(vm.user.supportGroups[i]._id, vm.messages.supportGroup[vm.user.supportGroups[i]._id]);
			// 	if(!vm.messages.supportGroup[vm.user.supportGroups[i]._id]){
			// 		console.log('adding group ' +vm.user.supportGroups[i]._id);
			// 		vm.messages.supportGroup[vm.user.supportGroups[i]._id] = [];
			// 	}
			// }
			if(vm.selectedSupportGroup)
				vm.selectedMessages = vm.messages.supportGroup[vm.selectedSupportGroup._id];
			console.log(vm.selectedMessages);
			$scope.$apply();
			$anchorScroll("bottom");

			if(vm.user.supportGroups.length > 0){
				console.log('setting up message receiving');
				Message.receive(function(message){
					console.log('received message');
					if(vm.user.blockedUsers.indexOf(message.sender._id) === -1){
						var wasAtBottom = vm.isScrolledBottom === true;
						vm.messages[message.messageType][message[message.messageType]].push(message);
						if(message.messageType === "supportGroup" && message.supportGroup !== vm.selectedSupportGroup._id){
							//add badge for unread messages
							var index = supportGroupIndex(message.supportGroup);
							if(!vm.user.supportGroups[index].unreadMessages)
								vm.user.supportGroups[index].unreadMessages = 0;
							vm.user.supportGroups[index].unreadMessages++;
							$scope.$apply();
						}
						else {
							$scope.$apply();
							if(wasAtBottom){
								$anchorScroll("bottom");							
							}
						}
					} else {
						console.log('message ignored, was on block list');
					}
				});
			}
		});

		//controller implementation

		$scope.$watch('vm.messageBoxHeight', adjustMessageHeight);

		$scope.$watch('vm.toolbarHeight', adjustMessageHeight);

		function adjustMessageHeight(){
			vm.messageListHeight = 'calc(100% - ' + (vm.messageBoxHeight + vm.toolbarHeight) + 'px)';
		}
		
		function userOptions(user, $event){
			$mdBottomSheet.show({
				parent: angular.element(document.getElementById('message-box')),
				templateUrl: 'app/message/partials/user-options.jade',
				controller: [ '$mdBottomSheet', UserOptionsController],
				controllerAs: "vm",
				disableBackdrop: false,
				disableParentScroll: true
				// bindToController : true,
				// targetEvent: $event
			}).then(function(clickedItem) {
				if(clickedItem === "report"){
					var promise = $mdDialog.show({
						controller: ['$scope', '$mdDialog', 'User', 'suspect', UserReportController],
						templateUrl: '/app/user/dialog/user-report.jade',
						parent: angular.element(document.body),
						targetEvent: $event,
						clickOutsideToClose:true,
						fullscreen: false,
						locals: {
							suspect: user
						}
					});
					promise.finally(function(){
						if(promise.$$state.value){
							$mdDialog.show(
								$mdDialog.confirm()
								.title('Report Submitted')
								.textContent('Your report for "' + user.username + '" has been submitted. Their case will be reviewed in the upcoming days. Thank you for your effort to improve the community.')
								.ariaLabel('Report Submitted')
								.ok('Okay')
								.targetEvent($event)
								);
						}
					});
				}
				else if(clickedItem === "block"){
					User.blockUser(user._id)
					.then(function(){
						vm.user.blockedUsers.push(user._id);
					})					
					.catch(console.error);
				}
			});

function UserOptionsController($mdBottomSheet) {
	var vm = this;
	vm.user = user;
	vm.reportUser = function(){
		$mdBottomSheet.hide("report");
	}

	vm.blockUser = function(){
		$mdBottomSheet.hide("block");
	}

	vm.closeBottomSheet = function(){
		$mdBottomSheet.cancel();
	};
}

function UserReportController($scope, $mdDialog, User, suspect){
	$scope.suspect = suspect._id;
	$scope.description = "";
	$scope.selectedReason = "";
	$scope.reasons = [];

	$scope.cancel = function(){
		$mdDialog.cancel();
	}

	$scope.reportUser = function(){
		User.reportUser($scope.suspect, $scope.selectedReason, $scope.description)
		.then(function(data){
			$mdDialog.hide(data);
		})
		.catch(console.error);
	}

	User.getReportReasons()
	.then(function(reasons){
		$scope.reasons = reasons;
	})
	.catch(console.error);
}	
}

function joinSupportGroup(){
	console.log('joining supportGroup');
	Message.joinSupportGroup(vm.supportGroupName);
}

function leaveSupportGroup(supportGroup, event){
	var promise = $mdDialog.show(
		$mdDialog.confirm()
		.title('Leave Support Group')
		.textContent('Are you sure you want to leave the "' + supportGroup.name + '" support group?')
		.ariaLabel('Leave support group')
		.ok('Yes')
		.cancel('No')
		.targetEvent(event)
		);
		//prevents using a template and controller for this dialog
		promise.finally(function(){
			if(promise.$$state.value){
				console.log('leaving support group "'+ supportGroup.name +'".');
				Message.leaveSupportGroup(supportGroup._id);
				//find and remove the messages and supportGroup from messages.supportGroup and user.supportGroups
				var chnIdx = supportGroupIndex(supportGroup._id);
				delete vm.messages.supportGroup[supportGroup._id];
				vm.user.supportGroups.splice(chnIdx, 1);
				console.log(vm.user);
				//if removed supportGroup was selected, select the one prior, or none if no remaining supportGroups
				if(vm.selectedSupportGroup._id === supportGroup._id){
					if(vm.user.supportGroups.length === 0){
						vm.selectedSupportGroup = {}; 
						vm.selectedMessages = [];							
					}
					else {
						vm.selectSupportGroup(vm.user.supportGroups[(chnIdx - 1 < 0 ? 0 : chnIdx - 1)]);
					}
				}
			}
		});
	}

	function selectSupportGroup(supportGroup){
		vm.selectedSupportGroup = supportGroup;
		vm.selectedMessages = vm.messages.supportGroup[vm.selectedSupportGroup._id];
		var index = supportGroupIndex(supportGroup._id);
		if(vm.user.supportGroups[index].unreadMessages)
			vm.user.supportGroups[index].unreadMessages = 0;
		$window.localStorage.selectedSupportGroupId = supportGroup._id;
		$mdSidenav('right').close();
		setTimeout(function(){
			$anchorScroll("bottom");
		},0);
	}

	function sendMessage(){
		if(vm.message.length > 0){
			Message.send("supportGroup-" + vm.selectedSupportGroup._id, vm.message);
			vm.message = "";
		}
	}

	function keyPressed(keyEvent){
		if ((keyEvent.which === 13) && !keyEvent.shiftKey){
			keyEvent.preventDefault();
			vm.sendMessage();
		}
	}

	function sidenavRightButtonClicked(){
		if($mdComponentRegistry.get('left') && $mdSidenav('left').isOpen() && !$mdSidenav('right').isOpen()){
			$mdSidenav('left').close()
			.then(function(){
				$mdSidenav('right').open();
			})
		}
		else{
			$mdSidenav('right').toggle();				
		}
	}

	// function sidenavLeftButtonClicked(){
	// 	vm.sidenavLeftOpen = !vm.sidenavLeftOpen; 
	// 	if(vm.sidenavRightOpen) vm.sidenavRightOpen = !vm.sidenavRightOpen;
	// }

	function goToProfile(user){
		console.log(user);
		$state.go("user-detail", {username: user.username});
	}

	//private functions
	function supportGroupIndex(supportGroupId){
		for(var i = 0; i < vm.user.supportGroups.length; i++){
			if(vm.user.supportGroups[i]._id === supportGroupId)
				return i;
		}
		return -1;
	}

	User.checkStatus()
	.then(function(){
		console.log('user token valid.');
	});
	console.log('message-list loaded.');
}
})();