angular
    .module('eArkPlatform.erms.mapfiles', ['pascalprecht.translate'])
    .config(config);

function config($stateProvider, languageFilesProvider, ermsServiceProvider ){

    $stateProvider.state('erms.mapfiles', {
        parent: 'erms.repos',
        url: '/mapfiles',
        views: {
            'repo-browser': {
                templateUrl : 'app/src/erms/modules/mapfiles/view/mapfilesView.html',
                controller : 'ErmsMapfilesController',
                controllerAs: 'emfc'
            }
        }
    });

    languageFilesProvider.addFile('app/src/erms/modules/mapfiles/i18n/','-mapfiles.json');
}