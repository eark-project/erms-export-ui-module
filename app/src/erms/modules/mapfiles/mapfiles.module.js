angular
    .module('eArkPlatform.erms.mapfiles', ['pascalprecht.translate'])
    .config(config);

function config($stateProvider, languageFilesProvider, ermsServiceProvider ){

    $stateProvider.state('erms.mapfiles', {
        parent: 'erms',
        url: '/mapfiles',
        views: {
            'erms': {
                templateUrl : 'app/src/erms/modules/mapfiles/view/mapfilesView.html',
                controller : 'ErmsMapfilesController',
                controllerAs: 'emfc'
            }
        }
    });

    languageFilesProvider.addFile('app/src/erms/modules/mapfiles/i18n/','-mapfiles.json');
}