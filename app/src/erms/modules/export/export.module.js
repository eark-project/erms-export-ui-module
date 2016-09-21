angular
    .module('eArkPlatform.erms.export', ['pascalprecht.translate'])
    .config(config);

function config($stateProvider, languageFilesProvider){

    $stateProvider.state('erms.pre-export', {
        parent: 'erms',
        url: '/pre-export',
        views: {
            'erms': {
                templateUrl : 'app/src/erms/modules/export/view/pre-exportView.html',
                controller  : 'ErmsExportController',
                controllerAs: 'rxc'
            }
        }
    }).state('erms.export', {
        parent: 'erms',
        url: '/export',
        views: {
            'erms': {
                templateUrl : 'app/src/erms/modules/export/view/exportView.html',
                controller  : 'ErmsExportController',
                controllerAs: 'rxc'
            }
        }
    });

    languageFilesProvider.addFile('app/src/erms/modules/export/i18n/','-export.json');

}