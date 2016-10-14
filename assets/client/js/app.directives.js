'use strict';

/* Directives */

angular.module('app').
directive('appVersion', function (version) {
	return function(scope, elm, attrs) {
		elm.text(version);
	};
})

.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter, {'event': event});
                });
                event.preventDefault();
            }
        });
    };
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
});