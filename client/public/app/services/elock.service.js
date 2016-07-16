(function(){
	'use strict';

	angular.module('services')
	.service('ELock', ['$window', '$mdDialog', 'Communication', ELockService]);

	function ELockService($window, $mdDialog, Communication){
		var positions = {
			top: ['user-create', 'user-agreement', 'support-group-list', 'support-group-detail', 'message-list', 'message-guidelines']
		};

		function lock(ev){
			if(!$window.localStorage.dialogAutoLock){
				$mdDialog.show({
					controller: LockConfirm,
					templateUrl: '/app/dialog/lock-confirm.jade',
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose:true,
					fullscreen: false
				});

				function LockConfirm($window, $scope, $mdDialog, Communication){
					$scope.autoLock = false;
					$scope.cancel = function(){
						if($scope.autoLock)
							$window.localStorage.dialogAutoLock = true;
						$mdDialog.cancel();
					}

					$scope.lock = function(){
						// console.log('yeaah');
						Communication.get('ban')
						.then(function(){
							$mdDialog.hide();
							if($scope.autoLock)
								$window.localStorage.dialogAutoLock = true;
							window.location.reload(true);
						})
						.catch(console.error);
					}
				}
			}
			else{
				Communication.get('ban')
				.then(function(){
					window.location.reload(true);
				})
				.catch(console.error);
			}
		}

		function visible(visibility){
			// document.getElementById('lock-fab-holder').style.display = visibility ? 'block' : 'none';
			// document.getElementById('lock-fab-holder').className = visibility ? 'lock-show' : 'lock-hide';
			var holder = document.getElementById('lock-fab-holder');
			var showIndex = holder.className.indexOf('lock-show'),
			hideIndex = holder.className.indexOf('lock-hide');
			if(showIndex !== -1 && visibility === false)
				holder.className = holder.className.replace('lock-show', 'lock-hide');
			if(hideIndex !== -1 && visibility === true)
				holder.className = holder.className.replace('lock-hide', 'lock-show');
			else if(showIndex === -1 && hideIndex === -1)
				holder.className += visibility ? ' lock-show' : ' lock-hide';
		}

		function position(pos){
			var holder = document.getElementById('lock-fab-holder');
			var topIndex = holder.className.indexOf('fab-top');
			var bottomIndex = holder.className.indexOf('fab-bottom');

			if(bottomIndex !== -1 && pos === 'top')
				holder.className = holder.className.replace('fab-bottom', 'fab-top');
			if(topIndex !== -1 && pos === 'bottom')
				holder.className = holder.className.replace('fab-top', 'fab-bottom');
			else if((topIndex === -1 && bottomIndex === -1) && (pos === 'top' || pos === 'bottom'))
				holder.className += ' fab-' + pos;
		}

		return {
			lock: lock,
			visible: visible,
			position: position,
			positions: positions
		};
	}
})();
