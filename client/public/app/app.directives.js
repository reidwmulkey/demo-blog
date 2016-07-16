'use strict';

/* Directives */

angular.module('app').
directive('appVersion', function (version) {
	return function(scope, elm, attrs) {
		elm.text(version);
	};
})

.directive('mdScrim', function () {
	return{
		scope: {
			scrimText: '@'
		},
		restrict: 'E',
		link: function(scope, element, attrs, controller) {
			element.css("overflow-x", "hidden");
			element.css("position", "relative");

			element.append('<md-scrim-img style="background-image: url(/public/shared/img/banner-teal.png); background-size: 100%; background-repeat: no-repeat; padding: 30px;"</md-scrim-img>');
			element.append('<md-scrim-title>' + scope.scrimText + '</md-scrim-title>');
			element.append("<md-scrim-overlay style=\"position: absolute;left: 50%;top: 0px;width: 100%;height: 100%;background: -moz-linear-gradient(top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0) 100%); /* FF3.6-15 */ background: -webkit-linear-gradient(top, rgba(0,0,0,1) 0%,rgba(0,0,0,0.5) 30%,rgba(0,0,0,0) 100%); /* Chrome10-25,Safari5.1-6 */ background: linear-gradient(to bottom, rgba(0,0,0,1) 0%,rgba(0,0,0,0.5) 30%,rgba(0,0,0,0) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */ filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00000000', endColorstr='#000000',GradientType=0 ); /* IE6-9 */\">" +
				"<md-scrim-container style='position: relative;left: -50%;height: 100%;width: 100%;'>" + 
				"<md-scrim-title style='margin: 0px; color: #fff;'>Test</md-scrim-title>" +
				"</md-scrim-container>" +
				"</md-scrim-overlay>");
			console.log(element[0].childNodes);
			var scrimIndex, titleIndex;
			for(var i = 0; i < element[0].childNodes.length; i++){
				if(element[0].childNodes[i].nodeName === 'MD-SCRIM-TITLE')
					titleIndex = i;
				else if(element[0].childNodes[i].nodeName === 'MD-SCRIM-OVERLAY')
					scrimIndex = i;
			}
			console.log(titleIndex, scrimIndex);
			// element[0].childNodes[titleIndex].style.color = "#f00";
			// element[0].childNodes[1].style.color = "#f00";
			// attrs.$observe('avatarSrc', function(newValue) {
			// 	var avatarSrc =  attrs.avatarSrc && attrs.avatarSrc.length > 0 ? attrs.avatarSrc: '/public/shared/img/defaultuser.png';
			// 	element[0].src = avatarSrc;
			// });
			// element.css("border-radius", "50%");
		}
	};
})

.directive('fabHolder', function ($compile) {
	return{
		scope: {
			position: '@'
		},
		restrict: 'E',
		link: function(scope, element, attrs, controller) {
			var button = '<md-button class="md-fab held-fab-button" aria-label="Emergency Lock" ng-click="rvm.ELock.lock()"><md-icon class="icon-white" md-svg-src="public/shared/img/icons/lock.svg"></md-icon></md-button>';
			var buttonContent = $compile(button)(scope);
			element.append(buttonContent);
			// console.log(element[0].childNodes);
			// var buttonIndex;
			// for(var i = 0; i < element[0].childNodes.length; i++){
			// 	console.log(element[0].childNodes[i].className);
			// 	if(element[0].childNodes[i].className.indexOf('held-fab-button') !== -1)
			// 		buttonIndex = i;
			// }
			// var button = element[0].childNodes[buttonIndex];
			// console.log(button);
			// button.append('');
			// element[0].childNodes[titleIndex].style.color = "#f00";
			// element[0].childNodes[1].style.color = "#f00";
			// attrs.$observe('avatarSrc', function(newValue) {
			// 	var avatarSrc =  attrs.avatarSrc && attrs.avatarSrc.length > 0 ? attrs.avatarSrc: '/public/shared/img/defaultuser.png';
			// 	element[0].src = avatarSrc;
			// });
			// element.css("border-radius", "50%");
		}
	};
})
.directive('aspectRatio', function ($window) {
	return{
		restrict: 'A',
		scope: {
			ratio: '@',
			minHeight: '@',
			maxHeight: '@'
		},
		link: function(scope, element, attrs, controller) {			
			element.css('min-width', '100%');
			element.css('max-width', '100%');
			if(scope.minHeight)
				element.css('min-height', scope.minHeight);
			if(scope.maxHeight)
				element.css('max-height', scope.maxHeight);

			$window.addEventListener('resize', resetSize, false);
			setTimeout(function(){
				resetSize();
			},0);
			
			function resetSize(){
				setTimeout(function(){
					var width = element[0].offsetWidth;
					var height = element[0].offsetHeight;
					var ratioString = scope.ratio;
					var widthRatio = parseInt(ratioString.substring(0, ratioString.indexOf(':')));
					var heightRatio = parseInt(ratioString.substring(ratioString.indexOf(':') + 1));
					var newHeight = (width / widthRatio) * heightRatio;
					element.css('height', newHeight + "px");
				},0);
			}
		}
	};
})
.directive('updateTitle', function($rootScope, $timeout, $location) {
	return {
		link: function(scope, element) {

			var listener = function(event, toState) {

				var title = 'ineedtotalk.org';
				if (toState.data && toState.data.pageTitle){
					title = toState.data.pageTitle;
					title += ' | ineedtotalk.org';
				}
				$timeout(function() {
					element.text(title);
					// console.log('replacing with', $location.url());
					// $location.url().replace();
					// try{
					// 	window.history.replaceState($location.url(), title, $location.absUrl());
					// 	console.log('replaced state with', $location.absUrl() + "FUCKING FUCK YEAH");
					// 	console.log(window.history);
					// }catch(e){
					// 	console.log(e);
					// }
				}, 0, false);
			};

			$rootScope.$on('$stateChangeSuccess', listener);
		}
	};
})
.directive('watchHeight', function ($window) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs, controller) {
			var vm = attrs.watchHeight.substring(0, attrs.watchHeight.indexOf('.'));
			var insideVar = attrs.watchHeight.substring(attrs.watchHeight.indexOf('.') + 1);
			scope.$watch(function () {
				return element[0].offsetHeight;
			},
			function (newValue, oldValue) {
				scope[vm][insideVar] = newValue;
			});
		}
	}
})
.directive('dedicationSrc', function(){
	return {
		restrict: 'A',
		scope: {
			dedicationSrc: '@'
		},
		link: function(scope, element, attrs, controller) {
			attrs.$observe('dedicationSrc', function(newValue) {	
				var dedicationSrc =  attrs.dedicationSrc && attrs.dedicationSrc.length > 0 ? attrs.dedicationSrc: '/public/shared/img/defaultuser.png';
				element[0].src = dedicationSrc;
			});
			// element.css("border-radius", "50%");
		}
	}
})
.directive('avatarSrc', function(){
	return {
		restrict: 'A',
		scope: {
			avatarSrc: '@'
		},
		link: function(scope, element, attrs, controller) {
			attrs.$observe('avatarSrc', function(newValue) {	
				var avatarSrc =  attrs.avatarSrc && attrs.avatarSrc.length > 0 ? attrs.avatarSrc: '/public/shared/img/defaultuser.png';
				element[0].src = avatarSrc;
			});
			element.css("border-radius", "50%");
		}
	}
})
// http://stackoverflow.com/questions/17063000/ng-model-for-input-type-file
.directive("fileread", [function () {
	return {
		scope: {
			fileread: "="
		},
		link: function (scope, element, attributes) {
			element.bind("change", function (changeEvent) {
				console.log(changeEvent);
				try{
					var reader = new FileReader();
					reader.onload = function (loadEvent) {
						scope.$apply(function () {
							scope.fileread = loadEvent.target.result;
						});
					}
					reader.readAsDataURL(changeEvent.target.files[0]);
				}catch(e){console.log(e);}
			});
		}
	}
}])
/*.directive('coverSrc', function(){
	return {
		restrict: 'A',
		scope: {
			coverSrc: '@',
			coverOffsetX: '@',
			coverOffsetY: '@'
		},
		link: function(scope, element, attrs, controller) {
			element.css("height", "250px");
			element.css("width", "100%");
			// element.css("min-height", "250px");
			// element.css("min-width", "400px");
			element.css("background-position", "center");
			element.css("background-attachment", "fixed");
			element.css("background-color", "#ccc");
			// element.css("background-size", "cover");
			// element.css("background-size", "100%");
			element.css("background-repeat", "no-repeat");

			attrs.$observe('coverSrc', function(newValue) {	
				if(newValue && newValue.length > 0){
					element.css("background-image", "url('" + newValue + "')");
					// element[0].src = newValue;
				}
			});

			attrs.$observe('coverOffsetX', function(newValue) {	
				var coverOffsetX = newValue ? newValue + "px" : "0px";
				element.css("background-position-x", coverOffsetX);
			});

			attrs.$observe('coverOffsetY', function(newValue) {	
				var coverOffsetY = newValue ? newValue + "px" : "0px";
				element.css("background-position-y", coverOffsetY);
			});

			attrs.$observe('backgroundSize', function(newValue) {	
				var backgroundSize = newValue ? newValue + "%" : "100%";
				element.css("background-size", backgroundSize);
			});
		}	
	}
})*/
.directive('sglCoverSrc', function(){
	return {
		restrict: 'A',
		scope: {
			coverSrc: '@'
		},
		link: function(scope, element, attrs, controller) {
			attrs.$observe('sglCoverSrc', function(newValue) {	
				if(newValue && newValue.length > 0){
					element.css("background-image", "url('" + newValue + "')");
				}
				else
					element.css("background-color", "rgb(0,151,167)");
			});
		}	
	}
})
.directive('onEnterKey', function () {
	return function (scope, element, attrs) {
		element.bind("keydown keypress", function (event) {
			if(event.which === 13) {
				scope.$apply(function (){
					scope.$eval(attrs.myEnter);
				});

				event.preventDefault();
			}
		});
	}
})
.directive('isScrolledBottom', function ($window) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs, controller) {
			var vm = attrs.isScrolledBottom.substring(0, attrs.isScrolledBottom.indexOf('.'));
			var insideVar = attrs.isScrolledBottom.substring(attrs.isScrolledBottom.indexOf('.') + 1);
			element.bind("scroll", function(){
				var messageBox = element[0];
				var isBottom = messageBox.scrollHeight - 1 <= messageBox.clientHeight + messageBox.scrollTop;
				scope[vm][insideVar] = isBottom;
			});
		}
	}
})
// .directive('richTextEditor', function() {
// 	return {
// 		restrict : "A",
// 		require : 'ngModel',
//         //replace : true,
//         transclude : true,
//         // template : '<div><textarea></textarea></div>',
//         link : function(scope, element, attrs, ctrl) {
//         	var textarea = element.wysihtml5({"html": true});
//         	// var textarea = element.find('textarea').wysihtml5();
//         	var editor = textarea.data('wysihtml5').editor;

// 			// view -> model
// 			editor.on('change', function() {
// 				if(editor.getValue())
// 					scope.$apply(function() {
// 						ctrl.$setViewValue(editor.getValue());
// 					});
// 			});

// 			// model -> view
// 			ctrl.$render = function() {
// 				textarea.html(ctrl.$viewValue);
// 				editor.setValue(ctrl.$viewValue);
// 			};

// 			ctrl.$render();
// 		}
// 	};
// })
;
// .directive('onCapsLock', function () {
// 	return {
// 		restrict: 'A',
// 		link: function(scope, element, attrs, controller) {
// 			element.bind("keydown keypress", function (event) {
// 				if((event.which >= 97 && event.which <= 122 && event.shiftKey) || (event.which >= 65 && event.which <= 90 && !event.shiftKey)) {
// 					scope.$apply(function (){
// 						scope.$eval(attrs.onCapsLock);
// 					});
// 					// event.preventDefault();
// 				}

// 			});
// 		}
// 	}
// });
