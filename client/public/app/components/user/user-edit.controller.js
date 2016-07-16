/*
This is my graveyard of failure.
RIP hopes and dreams.
*/
(function(){
	'use strict';

	angular.module('user')
	.controller('user-edit', ['$q','$scope', '$mdDialog', '$mdToast', 'sidenavLeft', 'User', userEdit]);

	function userEdit($q, $scope, $mdDialog, $mdToast, sidenavLeft, User){
		//variables
		var vm = this;
		vm.sidenavLeft = sidenavLeft;
		vm.options = {
			language: 'en',
			allowedContent: true,
			entities: false
		};

		vm.user = {};
		vm.content = "";
		vm.avatarPhoto = ""; //saves the avatar photo the user has selected and then cropped
		vm.cropPhoto = ""; //saves the cropped result to see if a popup is needed again for cropping
		vm.profanityFilter = false;
		// vm.coverPhoto = ""; //saves the cover photo
		// var previousMousePos = null;
		// vm.coverOffsetX = 0;
		// vm.coverOffsetY = 0;
		// vm.backgroundSize = 100;
		// vm.minZoom = 25;
		// vm.maxZoom = 200;
		// vm.zoomInc = 10;
		// vm.coverEdit = false;
		// vm.coverMoving = false;
		// vm.fontType = ""; //shouldn't really be used for any reason other than it needs to exist?
		// vm.editor = new wysihtml5.Editor('editor', {
		// 	toolbar: 'edit-toolbar',
		// 	parserRules:  wysihtml5ParserRules
		// });
		// var ckpromise = $q.defer(); //used to async load both user object and ckeditor

		//functions
		vm.getUser = getUser;
		vm.getPhotos = getPhotos;
		// vm.updateProfile = updateProfile;
		vm.save = save;
		vm.updatePassword = updatePassword;
		vm.unblockUser = unblockUser;
		vm.clickAvatarButton = clickAvatarButton;
		// vm.ckReady = ckReady;
		// vm.coverEditToggled = coverEditToggled;
		// vm.coverMoved = coverMoved;
		// vm.coverMouseDown = coverMouseDown;
		// vm.coverMouseUp = coverMouseUp;
		// vm.coverZoomIn = coverZoomIn;
		// vm.coverZoomOut = coverZoomOut;
		// vm.clickCoverButton = clickCoverButton;
		
		//implementation

		$scope.$watch('vm.avatarPhoto', function(newValue){
			if((newValue && newValue.length > 0) && vm.avatarPhoto !== vm.cropPhoto){
				var promise = $mdDialog.show({
					locals: {myImage: newValue},
					controller: UserCrop,
					templateUrl: '/app/user/dialog/user-crop.jade',
					parent: angular.element(document.body),
					// targetEvent: ev,
					clickOutsideToClose:true,
					fullscreen: false
				});

				promise.then(function(data){
					vm.cropPhoto = data;
					vm.avatarPhoto = data;
				})
				.catch(function(error){
					console.error(error);
				})
			}
		});

		function UserCrop($scope, $mdDialog, myImage){
			$scope.myImage = myImage;
			$scope.myCroppedImage = "";

			$scope.cancel = function(){
				$mdDialog.cancel();
			}

			$scope.cropImage = function(){
				$mdDialog.hide($scope.myCroppedImage);
			}
		}

		function unblockUser(user, ev){
			User.unblockUser(user._id)
			.then(function(){
				for(var i = 0; i < vm.user.blockedUsers.length; i++){
					if(vm.user.blockedUsers[i]._id === user._id){
						vm.user.blockedUsers.splice(i,1);
						break;
					}
				}
				$mdToast.show($mdToast.simple().textContent("User " + user.username + " is no longer blocked."));	
			})
			.catch(console.error);
		}

		function updatePassword(ev){
			$mdDialog.show({
				controller: UserPassword,
				templateUrl: '/app/user/dialog/user-password.jade',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:true,
				fullscreen: false
			})
		}

		function UserPassword($scope, $mdDialog, $mdToast, User){

			$scope.cancel = function(){
				$mdDialog.cancel();
			}

			$scope.updatePassword = function(){
				checkPassword()
				.then(function(){
					return User.updatePassword($scope.currentPassword, $scope.newPassword);
				})
				.then(function(){
					$mdToast.show($mdToast.simple().textContent("Successfully changed password."));				
					$mdDialog.hide();
				})
				.catch(function(err){
					$mdToast.show($mdToast.simple().textContent(err.data));
				});
			}

			$scope.keyPressed = function(keyEvent){
				if (keyEvent.which === 13){
					$scope.updatePassword();
				}	
			}

			function checkPassword(){
				var deferred = $q.defer();
				if($scope.newPassword != $scope.passwordConfirm)
					deferred.reject({data:"Password didn't match confirmation."});
				else
					deferred.resolve();
				return deferred.promise;
			}
		}

		function clickAvatarButton(){
			document.getElementById('avatar-photo').click();
		}

		// function clickCoverButton(){
		// 	document.getElementById('cover-photo').click();
		// }

		// function ckReady(){
		// 	ckpromise.resolve();
		// }

		//removed cover logic
		/*function coverEditToggled(){
			vm.coverEdit = !vm.coverEdit;
		}

		function coverMoved(event){
			if(vm.coverEdit && vm.coverMoving){
				// vm.coverOffsetX += event.clientX - previousMousePos.x;
				vm.coverOffsetY += event.clientY - previousMousePos.y;
				previousMousePos = {
					x: event.clientX,
					y: event.clientY						
				};	
			}
		}

		function coverMouseDown(event){
			previousMousePos = {
				x: event.clientX,
				y: event.clientY						
			};
			vm.coverMoving = true;
		}

		function coverMouseUp(){
			vm.coverMoving = false;
			previousMousePos = null;
		}

		function coverZoomOut(){
			if(vm.backgroundSize - vm.zoomInc >= vm.minZoom)
				vm.backgroundSize -= vm.zoomInc;
		}

		function coverZoomIn(){
			if(vm.backgroundSize + vm.zoomInc <= vm.maxZoom)
				vm.backgroundSize += vm.zoomInc;
		}*/

		function save(){
			updateProfile()
			.then(updateProfanityFilter)
			// .then(uploadCover)
			.then(uploadAvatar)
			.then(function(data){
				$mdToast.show($mdToast.simple().textContent("Successfully saved account details."));
			})
			.catch(function(err){
				$mdToast.show($mdToast.simple().textContent(err.data));
			});
		}

		function updateProfile(){
			return User.updateProfile(vm.content);		
		}

		function updateProfanityFilter(){
			if(vm.profanityFilter !== vm.user.profanityFilter)
				return User.updateProfanityFilter(vm.profanityFilter);		
			else {
				var deferred = $q.defer();
				deferred.resolve();
				return deferred.promise;
			}
		}

		/*function uploadCover(){
			var deferred = $q.defer();
			if(vm.coverPhoto && vm.coverPhoto.indexOf('intt.s3.amazonaws.com/cover/') === -1)
			{
				User.uploadB64(vm.coverPhoto, "cover")
				.then(function(photo){
					deferred.resolve();
				})
				.catch(deferred.reject);
			}
			else{
				deferred.resolve();
			}
			return deferred.promise;
		}*/

		function uploadAvatar(){	
			var deferred = $q.defer();
			if(vm.avatarPhoto && vm.avatarPhoto.indexOf('intt.s3.amazonaws.com/avatar/') === -1){
				User.uploadB64(vm.avatarPhoto, "avatar")
				.then(function(photo){
					deferred.resolve();
				})
				.catch(deferred.reject);				
			}
			else{
				deferred.resolve();
			}
			return deferred.promise;

		}

		function getUser(){
			return User.getById();
		}

		function getPhotos(){
			User.getPhotos()
			.then(function(photos){
				console.log(photos);
			})
			.catch(console.error);
		}

		$q.all([
			vm.getUser()
			// ckpromise
			])
		.then(function(results){ 
			vm.user = results[0];
			console.log(vm.user);
			vm.content = vm.user.profile;
			vm.cropPhoto = vm.user.avatar;
			vm.avatarPhoto = vm.user.avatar;
			vm.profanityFilter = vm.user.profanityFilter;
			// vm.coverPhoto = vm.user.cover;
		}).catch(function(err){
			$mdToast.show($mdToast.simple().textContent(err.data));
		});
	}
})();