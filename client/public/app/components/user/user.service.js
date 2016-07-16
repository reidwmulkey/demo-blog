(function(){
	'use strict';

	angular.module('user')
	.service('User', ['$q', '$window', 'Communication', UserService]);

	function UserService($q, $window, Communication){
		function getByUsername(username){
			return Communication.get("api/auth/users", {
				username: username
			});
		}

		function getById(userId){
			return Communication.get("api/auth/users", userId ? {userId: userId} : null);
		}

		function login(username, password){
			var deferred = $q.defer();
			Communication.post("api/login", {
				username: username,
				password: password
			}).then(function(data){
				$window.localStorage.accessToken = data.token;
				deferred.resolve();
			}).catch(deferred.reject);
			return deferred.promise;
		}

		function verify(username, password, emailKey){
			return Communication.post("api/validate-email", {
				username: username,
				password: password,
				emailKey: emailKey
			});
		}

		function create(email, username, password, subscribedToNewsletter){
			console.log(subscribedToNewsletter);
			return Communication.put("api/signup", {
				email: email,
				username: username,
				password: password,
				subscribedToNewsletter: subscribedToNewsletter
			});
		}

		function updateProfile(profile){
			return Communication.post("api/auth/users/profile", {
				profile: profile
			});
		}

		function updateProfanityFilter(profanityFilter){
			return Communication.post("api/auth/users/profanity-filter", {
				profanityFilter: profanityFilter
			});
		}

		function acceptGuidelines(){
			return Communication.post("api/auth/users/accept-guidelines");
		}

		function updatePassword(password, newPassword){
			return Communication.post("api/auth/users/password", {
				password: password,
				newPassword: newPassword
			});
		}

		function forgotPassword(email){
			return Communication.post("api/forgot-password", {
				email: email
			});
		}

		function uploadB64(imageBinary, folder){
			return Communication.post("api/auth/users/upload-b64", {
				imageBinary: imageBinary,
				folder: folder
			});
		}

		function getPhotos(userId){
			return Communication.get("api/auth/users/photos", {
				userId: userId
			});
		}

		function unblockUser(unblockId){
			return Communication.post("api/auth/users/unblock", {
				unblockId: unblockId
			});
		}

		function blockUser(blockId){
			return Communication.post("api/auth/users/block", {
				blockId: blockId
			});
		}

		function reportUser(suspectId, reason, description){
			return Communication.put("api/auth/users/report", {
				suspectId: suspectId,
				reason: reason,
				description: description
			});
		}

		function getReportReasons(){
			return Communication.get("api/auth/users/report/reasons");
		}

		function checkStatus(){
			return Communication.get("api/auth/users/status");
		}

		return {
			getById: getById,
			getByUsername: getByUsername,
			login: login,
			verify: verify,
			create: create,
			checkStatus: checkStatus,
			acceptGuidelines: acceptGuidelines,
			updateProfile: updateProfile,
			updateProfanityFilter: updateProfanityFilter,
			updatePassword: updatePassword,
			forgotPassword: forgotPassword,
			uploadB64: uploadB64,
			getPhotos: getPhotos,
			blockUser: blockUser,
			unblockUser: unblockUser,
			reportUser: reportUser,
			getReportReasons: getReportReasons
		};
	}
})();