(function(){
	'use strict';

	angular.module('feedback')
	.service('Feedback', ['$q', '$window', 'Communication', FeedbackService]);

	function FeedbackService($q, $window, Communication){
		function sendFeedback(votes, additionalFeatures, additionalSupportGroups, comment){
			return Communication.put("api/auth/feedback", {
				votes: votes,
				additionalFeatures: additionalFeatures,
				additionalSupportGroups: additionalSupportGroups,
				comment: comment
			});
		}

		function getAllFeatures(){
			return Communication.get("api/auth/feedback");
		}

		return {
			getAllFeatures: getAllFeatures,
			sendFeedback: sendFeedback

		};
	}
})();