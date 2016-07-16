(function(){
	'use strict';

	angular.module('services')
	.service('Load', ['$q', LoadService]);

	function LoadService($q){
		var keepDo = false, timer;
		function startLoading(){
			keepDo = true;
			// document.getElementsByTagName('body')[0].style.opacity = .8;
			// This is way too complicated and leads to so many issues. Just going to use body.
			/*var view = document.getElementsByTagName('ui-view')[0];
			if(view){
				var fullContent = view.getElementsByClassName('full-content');
				console.log(fullContent);
				if(fullContent && fullContent.length === 1)
					fullContent[0].style.opacity = .4;
			}*/
			setTimeout(function(){
				if(keepDo){
					document.getElementById('load-container').style.display = "inherit";
					promiseThisWorks()
					.then(turnOffAnimation)
					.catch(console.error);
				}
			},200);
		}	

		function promiseThisWorks(){
			var deferred = $q.defer();
			timer = setInterval(function(){
				if(!keepDo)
					deferred.resolve();
				console.log('if these keeps spamming and nothing is loading, then reid has messed up. Please tell him at reid@ineedtotalk.org. Also, go you! finding the dev console.');
			},1500);
			return deferred.promise;
		}

		function turnOffAnimation(){
			var deferred = $q.defer();
			document.getElementById('load-container').style.display = "none";
			window.clearInterval(timer);
			timer = null;
			return deferred.promise;
		}

		function stopLoading(){
			keepDo = false;
			// document.getElementsByTagName('body')[0].style.opacity = 1.0;
		}

		return {
			startLoading: startLoading,
			stopLoading: stopLoading
		};
	}
})();
