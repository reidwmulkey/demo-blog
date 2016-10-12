(function(){
	'use strict';

	angular.module('services')
	.service('Load', [LoadService]);

	function LoadService(){
		function startLoading(){
			document.getElementById('load-container').style.display = "block";
		}	
		function stopLoading(){
			document.getElementById('load-container').style.display = "none";
		}

		function isLoading(){
			return window.getComputedStyle(document.getElementById('load-container')).getPropertyValue('display') === 'block';
		}

		return {
			startLoading: startLoading,
			stopLoading: stopLoading
		};
	}
})();
