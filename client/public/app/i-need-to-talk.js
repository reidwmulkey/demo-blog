(function(){
  'use strict';

  function nullFcn(val){
    return val;
  }

  // Declare app level module which depends on filters, and services
  angular.module('ineedtotalk', [
    // 'ngRoute',
    // 'ngModel',
    'ui.router',
    'ngAnimate',
    'ngMaterial',
    'ngMessages',
    'ngProfanity',
    // 'ckeditor',
    'textAngular',
    'truncate',
    'app',
    'services',
    'factories',
    'feedback',
    'user',
    'message',
    'support-group',
    'error',
    'information',
    'donate',
    'dedication'
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
    //using ui-router
    /*$stateProvider
    .state('index', {
      url: '/',
      templateUrl: 'app/index.jade'
    }).
    state('message-list', {
      url: '/message/list',
      templateUrl: 'app/message/message-list.jade',
      controller: 'message-list as vm'
    })
    .state('user-login', {
      url: '/user/login',
      templateUrl: 'app/user/user-login.jade',
      params: {transitionMessage: null},
      controller: 'user-login as vm'
    })
    .state('user-edit', {
      url: '/user/edit',
      templateUrl: 'app/user/user-edit.jade',
      controller: 'user-edit as vm'
    })
    .state('user-verify', {
      url: '/user/verify-email/:emailKey',
      templateUrl: 'app/user/user-verify.jade',
      controller: 'user-verify as vm'
    })
    .state('user-create', {
      url: '/user/create',
      templateUrl: 'app/user/user-create.jade',
      controller: 'user-create as vm'
    })
    .state('user-detail', {
      url: '/user/detail/:username',
      templateUrl: 'app/user/user-detail.jade',
      controller: 'user-detail as vm'
    })
    .state('feedback-submit', {
      url: '/feedback/submit',
      templateUrl: 'app/feedback/feedback-submit.jade',
      controller: 'feedback-submit as vm'
    })
    .state('support-group-list', {
      url: '/support-group/list',
      templateUrl: 'app/support-group/support-group-list.jade',
      controller: 'support-group-list as vm'
    })
    .state('support-group-detail', {
      url: '/support-group/detail/:supportGroupId',
      templateUrl: 'app/support-group/support-group-detail.jade',
      controller: 'support-group-detail as vm'
    });*/

$stateProvider
// .state('app', {
//   abstract: true,
//   controller: 'app-control as vm',
//   // template: '<ui-view style="overflow:hidden;"></div>'
// })
.state('index', {
  // parent: 'app',
  url: '/',
  templateUrl: 'app/index.jade',
  controller: 'index-ctrl as vm'
}).
state('message-list', {
  // parent: 'app',
  url: '/message/list',
  templateUrl: 'app/message/message-list.jade',
  controller: 'message-list as vm',
  data: {pageTitle: "Messages"}
}).
state('message-guidelines', {
  url: '/message/guidelines',
  templateUrl: 'app/message/message-guidelines.jade',
  controller: 'message-guidelines as vm',
  data: {pageTitle: "Messaging Guidelines"}
}).
state('about', {
  url: '/about',
  templateUrl: 'app/information/about.jade',
  controller: 'about-ctrl as vm',
  data: {pageTitle: "About"}
}).
state('donate-detail', {
  url: '/donate/detail',
  templateUrl: 'app/donate/donate-detail.jade',
  controller: 'donate-detail as vm',
  data: {pageTitle: "Donate"}
}).
state('dedication-create', {
  url: '/dedication/create/:dedicationId',
  templateUrl: 'app/dedication/dedication-create.jade',
  data: {pageTitle: "Create a dedication"},
  controller: 'dedication-create as vm'
}).
state('dedication-detail', {
  url: '/dedication/detail/:dedicationId',
  templateUrl: 'app/dedication/dedication-detail.jade',
  data: {pageTitle: "Dedication Detail"},
  controller: 'dedication-detail as vm'
}).
state('dedication-list', {
  url: '/dedication/list',
  templateUrl: 'app/dedication/dedication-list.jade',
  data: {pageTitle: "Dedications"},
  controller: 'dedication-list as vm'
}).
state('contact', {
  url: '/contact',
  templateUrl: 'app/information/contact.jade',
  controller: 'contact-ctrl as vm',
  data: {pageTitle: "Contact & Credits"}
})
.state('user-login', {
  url: '/user/login',
  templateUrl: 'app/user/user-login.jade',
  params: {transitionMessage: null},
  controller: 'user-login as vm',
  data: {pageTitle: "Login"}
}).
state('user-agreement', {
  url: '/user/agreement',
  templateUrl: 'app/user/user-agreement.jade',
  controller: 'user-agreement as vm',
  data: {pageTitle: "Terms of Service"}
}).
state('user-edit', {
  url: '/user/edit',
  templateUrl: 'app/user/user-edit.jade',
  controller: 'user-edit as vm',
  data: {pageTitle: "Manage Account"}
})
.state('user-verify', {
  url: '/user/verify-email/:emailKey',
  templateUrl: 'app/user/user-verify.jade',
  controller: 'user-verify as vm',
  data: {pageTitle: "Account Verification"}
})
.state('user-create', {
  url: '/user/create',
  templateUrl: 'app/user/user-create.jade',
  controller: 'user-create as vm',
  data: {pageTitle: "Create an account"}
})
.state('user-detail', {
  url: '/user/detail/:username',
  templateUrl: 'app/user/user-detail.jade',
  controller: 'user-detail as vm',
  data: {pageTitle: "View Profile"}
})
.state('feedback-submit', {
  url: '/feedback/submit',
  templateUrl: 'app/feedback/feedback-submit.jade',
  controller: 'feedback-submit as vm',
  data: {pageTitle: "Feedback"}
})
.state('support-group-list', {
  url: '/support-group/list',
  templateUrl: 'app/support-group/support-group-list.jade',
  controller: 'support-group-list as vm',
  data: {pageTitle: "Support group list"}
})
.state('support-group-detail', {
  url: '/support-group/detail/:supportGroupUrl',
  templateUrl: 'app/support-group/support-group-detail.jade',
  controller: 'support-group-detail as vm',
  data: {pageTitle: "Support group information"}
})
.state('404', {
  url:'/404',
  templateUrl: 'app/_404',
  controller: 'error-404 as vm',
  data: {pageTitle: "Page not found"}
})
;
    // $urlRouterProvider.when('/admin', '/admin');
    $urlRouterProvider.otherwise('/404');
    $locationProvider.html5Mode(true);
  });
// .
// config(function ($routeProvider, $locationProvider) {
//     //using ngRouter
//     console.log('yay');
//     $routeProvider.
//     when('/', {
//       templateUrl: 'partials/index.jade'
//       // controller: 'index'
//     }).
//     when('/signup', {
//       templateUrl: 'partials/user/user-create.jade',
//       controller: 'user-create as vm'
//     }).
//     when('/login', {
//       templateUrl: 'partials/user-login.jade',
//       controller: 'user-login as vm'
//     }).
//     when('/messages', {
//       templateUrl: 'partials/messages.jade',
//       controller: 'message-list as vm'
//     }).
//     when('/home', {
//       templateUrl: 'partials/home.jade'
//     }).
//     otherwise({
//       redirectTo: '/'
//     });
//     $locationProvider.html5Mode(true);
//   });
})();
