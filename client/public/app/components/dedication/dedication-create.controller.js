(function(){
	'use strict';

	angular.module('dedication')
	.controller('dedication-create', ['$q','$scope', '$mdDialog', '$mdToast', '$stateParams', 'sidenavLeft', 'Dedication', DedicationCreate]);

	function DedicationCreate($q, $scope, $mdDialog, $mdToast, $stateParams, sidenavLeft, Dedication){
		//variables
		var vm = this;
		vm.sidenavLeft = sidenavLeft;
		vm.options = {
			language: 'en',
			allowedContent: true,
			entities: false
		};
		vm.dedicationId = $stateParams.dedicationId;

		vm.to = "";
		vm.dedicationPhoto = "";
		vm.text = "";

		//functions
		vm.clickPhotoButton = clickPhotoButton;
		vm.createDedication = createDedication;
		
		//implementation

		function clickPhotoButton(){
			document.getElementById('dedication-photo').click();
		}

		function createDedication(){
			Dedication.create(vm.dedicationId, vm.to, vm.text)
			.then(function(dedication){
				return uploadDedicationPhoto(dedication._id);
			})
			.then(function(data){
				$mdToast.show($mdToast.simple().textContent("Successfully created your dedication."));
			})
			.catch(function(err){
				$mdToast.show($mdToast.simple().textContent(err.data));
			});
		}

		function uploadDedicationPhoto(dedicationId){	
			var deferred = $q.defer();
			if(vm.dedicationPhoto && vm.dedicationPhoto.indexOf('intt.s3.amazonaws.com/dedication/') === -1){
				Dedication.uploadB64(vm.dedicationPhoto, "dedication", dedicationId)
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
	}
})();