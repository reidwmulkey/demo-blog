(function(){
  'use strict';

  angular.module('app', []);
})();

(function(){
	'use strict';
	angular.module('factories', []);
})();

//this module is only to contain global services used throughout the application
//a specific services (e.g. user.service.js) should be included in the
//components/user folder
(function(){
	'use strict';
	angular.module('services', []);
})();

(function(){
	'use strict';

	angular.module('factories')
	.factory('Config', [ConfigFactory]);

	function ConfigFactory(){
		var config = {
			serverURL: 'http://localhost:9001/'
			// serverURL: 'https://dev.ineedtotalk.org/'
			// serverURL: 'http://ineedtotalk.org:9001/'
		};
		return config;
	}
})();
(function(){
	'use strict';

	angular.module('services')
	.service('Communication', ['$http', '$q', '$state', 'Config', 'Load', CommunicationService]);

	function CommunicationService($http, $q, $state, Config, Load){
		function common(path, method, queryParams, body){
			var deferred = $q.defer();
			var headers = {'Content-Type': 'application/json'};
		
			var req = {
				method: method,
				url: Config.serverURL + path,
				headers: headers,
				params: queryParams ? queryParams : null
			};
			
			if((method != 'GET') && body)
				req.data = body;
			Load.startLoading();

			$http(req).then(function(resp){
				deferred.resolve(resp.data);
			})
			.catch(function(error){
				deferred.reject(error);
			})
			.finally(Load.stopLoading);
			return deferred.promise;
		}

		return {
			get: function(path, queryParams){
				return common(path, 'GET', queryParams, null);	
			},
			put: function(path, body){
				return common(path, 'PUT', null, body);	
			},
			post: function(path, body){
				return common(path, 'POST', null, body);	
			},
		};
	}
})();

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

(function(){
	'use strict';

	angular.module('services')
	.service('SearchMenu', ['$mdSidenav', '$mdComponentRegistry', '$state', SearchMenu]);

	function SearchMenu($mdSidenav, $mdComponentRegistry, $state){
		function toggle(){
			if($mdComponentRegistry.get('right') && $mdSidenav('right').isOpen() && !$mdSidenav('left').isOpen()){
				$mdSidenav('right').close()
				.then(function(){
					$mdSidenav('left').open();
				})
			}
			else{
				$mdSidenav('left').toggle();				
			}
		}

		return {
			toggle: toggle
		};
	}
})();

(function(){
	'use strict';

	angular.module('services')
	.service('Wooted', ['$http', '$q', '$state', 'Communication', WootedService]);

	function WootedService($http, $q, $state, Communication){
		function getItem(itemId){
			return Communication.get('api/items/detail', {
				itemId: itemId
			});
		}

		function search(itemName, selectedSites){
			return Communication.get('api/items/search', {
				itemName: itemName,
				selectedSites: selectedSites
			})
		}

		return {
			getItem: getItem,
			search: search
		};
	}
})();

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
.directive('bindSrc', function(){
	return {
		restrict: 'A',
		scope: {
			avatarSrc: '@'
		},
		link: function(scope, element, attrs, controller) {
			attrs.$observe('bindSrc', function(newValue) {	
				var bindSrc =  attrs.bindSrc && attrs.bindSrc.length > 0 ? attrs.bindSrc: '';
				element[0].src = bindSrc;
			});
			element.css("border-radius", "5px");
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

'use strict';

/* Filters */

angular.module('app')
.filter('interpolate', function (version) {
	return function (text) {
		return String(text).replace(/\%VERSION\%/mg, version);
	};
})
.filter('reverse', function() {
	return function(items) {
		return items ? items.slice().reverse() : [];
	};
})
.filter('html', function($sce) {
	return function(val) {
		return $sce.trustAsHtml(val);
	};
});;

(function(){
	'use strict';

	angular.module('app')
	.controller('app-control', ['SearchMenu', appController]);

	function appController(SearchMenu){
		var rvm = this;
		rvm.SearchMenu = SearchMenu;
		/*rvm.isLoading = false;

		rvm.startLoading = function(){
			rvm.isLoading = true;
		}

		rvm.stopLoading = function(){
			rvm.isLoading = false;
		}*/
	}
})();
(function(){
	'use strict';

	angular.module('app')
	.controller('index-ctrl', ['$state', '$scope', '$mdDialog', '$mdToast', 'Wooted', 'SearchMenu', indexCtrl]);

	function indexCtrl($state, $scope, $mdDialog, $mdToast, Wooted, SearchMenu){
		var vm = this;
		vm.items;
		vm.selectSpecificSites = false;
		vm.availableSites = [
			{ name:'woot', url:'http://www.woot.com' }, 
			{ name:'electronics', url:'http://electronics.woot.com' }, 
			{ name:'home', url:'http://home.woot.com' }, 
			{ name:'tools & garden', url:'http://tools.woot.com' }, 
			{ name:'sport', url:'http://sport.woot.com' }, 
			{ name:'accessories & watches', url:'http://accessories.woot.com' }, 
			{ name:'wine', url:'http://wine.woot.com' }
		];
		vm.selectedSites = [];
		vm.itemName = '';

		vm.selectSite = function(site) {
			var index = vm.selectedSites.indexOf(site.name);
		    if(index > -1) 
		      vm.selectedSites.splice(index, 1);
		    else 
		      vm.selectedSites.push(site.name);
		}

		vm.search = function(){
			Wooted.search(vm.itemName, vm.selectedSites.length > 0 ? vm.selectedSites : null)
			.then(function(items){
				vm.items = items;
				SearchMenu.toggle();
				// console.log(vm.items);
			})
			.catch(function(error){
				// console.error(error);
				$mdToast.show($mdToast.simple().textContent(error.data));
			})
		}

		vm.selectItem = function(item){
			$mdDialog.show({
				controller: ['$scope', '$mdDialog', 'Wooted', ItemDetailCtrl],
				templateUrl: '/assets/client/views/app/item-detail.html',
				parent: angular.element(document.body),
				clickOutsideToClose:true,
				fullscreen: false,
				locals: {
					item: item
				}
			})

			function ItemDetailCtrl($scope, $mdDialog, Wooted){
				$scope.item = item;
				console.log($scope.item);

				Wooted.getItem($scope.item._id)
				.then(function(item){
					$scope.item = item;
					if($scope.item.instances.length > 0)
						$scope.item.lastSold = $scope.item.instances[0].date;
					var averagePrice = 0;
					for(var i = 0; i < $scope.item.instances.length; i++){
						var price = $scope.item.instances[i].price;
						price = price.split('$').join('');
						if(price.indexOf('-') !== -1){
							//price range - take average price of the range and add to average price
							var priceArray = price.split('-');
							var p1 = parseFloat(priceArray[1]);
							var p0 = parseFloat(priceArray[0]);
							var midRangePrice = ((p1 - p0) / 2) + p0;
							averagePrice += midRangePrice;
							console.log(midRangePrice);
						}
						else {
							//just a dollar amount
							averagePrice += parseFloat(price);
						}
					}
					$scope.item.averagePrice = roundToDollarAmount(averagePrice / $scope.item.instances.length);
					console.log($scope.item);
				}).catch(function(error){
					$mdToast.show($mdToast.simple().textContent(error.data));
				});

				$scope.close = function(){
					$mdDialog.hide();
				}

				//http://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-in-javascript
				function roundToDollarAmount(num){
					return +(Math.round(num + "e+2")  + "e-2");
				}
			}
		}

		console.log('loaded index.controller.js');
	}
})();
(function(){
  'use strict';

  function nullFcn(val){
    return val;
  }

  // Declare app level module which depends on filters, and services
  angular.module('wooted', [
    // 'ngRoute',
    // 'ngModel',
    'ui.router',
    'ngAnimate',
    'ngMaterial',
    'md.data.table',
    'ngMdIcons',
    'truncate',

    'app',
    'services',
    'factories'
    ])
  .
  config(function ($mdThemingProvider, $stateProvider, $urlRouterProvider, $locationProvider, $urlMatcherFactoryProvider) {
    $urlMatcherFactoryProvider.type('nonURIEncoded', {
      encode: nullFcn,
      decode: nullFcn,
      is: function () { return true; }
    });
    $mdThemingProvider.theme('default')
    .primaryPalette('green', {
      'default': '800', // by default use shade 400 from the pink palette for primary intentions
      'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
      'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
      'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
    })
    .accentPalette('amber', {
      'default': '800' // use shade 200 for default, and keep all other shades the same
    })
    // .backgroundPalette('cyan', {
    //   'default': '50'
    // });
    
    $stateProvider
    .state('index', {
      url: '/',
      templateUrl: '/assets/client/views/app/index.html',
      controller: 'index-ctrl as vm'
    });
    $locationProvider.html5Mode(true);
  });
})();
