(function(){
	'use strict';

	angular.module('dedication')
	.service('Dedication', ['$q', '$window', 'Communication', DedicationService]);

	function DedicationService($q, $window, Communication){
		/*function getById(dedicationId){
			return Communication.get("api/auth/dedications", dedicationId ? {dedicationId: dedicationId} : null);
		}*/

		function getAll(){
			return Communication.get("api/exposed/dedications");
		}

		function getById(dedicationId){
			return Communication.get("api/exposed/dedications", {
				dedicationId: dedicationId
			});
		}

		function create(incDedicationId, to, text){
			return Communication.put("api/auth/dedications", {
				dedicationId: incDedicationId,
				to: to,
				text: text
			});
		}

		
		function uploadB64(imageBinary, folder, dedicationId){
			return Communication.post("api/auth/dedications/upload-b64", {
				imageBinary: imageBinary,
				folder: folder,
				dedicationId: dedicationId
			});
		}

		function search(searchText){
			return Communication.get("api/auth/dedications", {
				searchText: searchText
			});
		}

		return {
			// getById: getById,
			search: search,
			getAll: getAll,
			getById: getById,
			create: create,
			uploadB64: uploadB64
		};
	}
})();