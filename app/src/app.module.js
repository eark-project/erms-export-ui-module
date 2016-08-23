angular
    .module('eArkPlatform', [
        'ngSanitize',
        'ngMaterial',
        'ngMessages',
        'material.wizard',
        'ui.router',
        'rt.encodeuri',
        'ngResource',
        'pdf',
        'swfobject',
        'isteven-multi-select',
        'eArkPlatform.init',
        'eArkPlatform.translations.init',
        'eArkPlatform.header',
        'eArkPlatform.dashboard',
        'eArkPlatform.erms',
        'eArkPlatform.erms.profile',
        'eArkPlatform.erms.export',
        'eArkPlatform.erms.repoView',
        'eArkPlatform.erms.mapfiles',
        'eArkPlatform.common.directives',
        'eArkPlatform.common.directives.filter',
        'dcbImgFallback',
        /*DO NOT REMOVE MODULES PLACEHOLDER!!!*/ //openDesk-modules
        /*LAST*/ 'eArkPlatform.translations'])// TRANSLATIONS IS ALWAYS LAST!
    .config(config)
    .run(function ($rootScope, $state, $mdDialog, APP_CONFIG) {
        angular.element(window.document)[0].title = APP_CONFIG.appName;
        $rootScope.appName = APP_CONFIG.appName;

        $rootScope.$on('$stateChangeStart', function (event, next, params) {
            $rootScope.toState = next;
            $rootScope.toStateParams = params;

            // If we got any open dialogs, close them before route change
            $mdDialog.cancel();
        });
    });

function config($mdThemingProvider, $stateProvider, $urlRouterProvider, $httpProvider) {
        //$httpProvider.interceptors.push('httpTicketInterceptor');
        //$httpProvider.defaults.headers.common.Authorization = undefined;
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('yellow')
        .warnPalette('deep-orange');

    $urlRouterProvider
        .otherwise('/');

    $stateProvider.state('site', {
        abstract: true,
        resolve: {},
        views: {
            'footer@': {
                templateUrl: 'app/src/footer/view/footer.html',
                controller: 'FooterController'
            },
            'header@': {
                templateUrl: 'app/src/header/view/header.html',
                controller: 'HeaderController',
                controllerAs: 'vm'
            }
        }
    }).state('dashboard', {
        parent: 'site',
        url: '/',
        views: {
            'content@': {
                templateUrl: 'app/src/dashboard/view/dashboard.html',
                controller: 'DashboardController',
                controllerAs: 'vm'
            }
        }
    });
}