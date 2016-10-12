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
    .primaryPalette('cyan', {
      'default': '700', // by default use shade 400 from the pink palette for primary intentions
      'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
      'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
      'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
    })
    .accentPalette('pink', {
      'default': '400' // use shade 200 for default, and keep all other shades the same
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
