(function(){
	'use strict';

	angular.module('support-group')
	.service('SupportGroup', ['$q', '$window', 'Communication', SupportGroupService]);

	function SupportGroupService($q, $window, Communication){
		
		function getAll(){
			return Communication.get("api/exposed/support-groups");
		}

		function get(supportGroupId, supportGroupUrl){
			var data = {};
			if(supportGroupId) data.supportGroupId = supportGroupId;
			else if(supportGroupUrl) data.supportGroupUrl = supportGroupUrl;
			console.log('getting support group with data: ', data);
			return Communication.get("api/exposed/support-groups", data);
		}

		function join(supportGroupId){
			return Communication.put("api/auth/support-groups", {
				supportGroupId: supportGroupId
			});	
		}

		return {
			getAll: getAll,
			get: get,
			join: join
		};
	}
})();