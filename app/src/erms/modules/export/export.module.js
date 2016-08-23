angular
    .module('eArkPlatform.erms.export', ['pascalprecht.translate'])
    .config(config);

function config($stateProvider, languageFilesProvider){

    $stateProvider.state('erms.export', {
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