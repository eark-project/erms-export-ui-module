angular
    .module('eArkPlatform.erms.repoView', ['ngMaterial', 'pascalprecht.translate'])
    .config(config);

function config($stateProvider, languageFilesProvider ){

    $stateProvider.state('erms.repos.browseRepo', {
        parent: 'erms',
        url: '/:profileName/:mapName/browse',
        views: {
            'erms': {
                templateUrl : 'app/src/erms/modules/repoView/view/repoView.html',
                controller : 'RepoViewController',
                controllerAs: 'rvc'
            }
        }
    }).state('erms.repos.searchRepo', {
        parent: 'erms',
        url: '/:profileName/:mapName/search',
        views: {
            'erms': {
                templateUrl : 'app/src/erms/modules/repoView/view/repoSearch.html',
                controller : 'RepoViewController',
                controllerAs: 'rvc'
            }
        }
    });

    languageFilesProvider.addFile('app/src/erms/modules/repoView/i18n/','-repoView.json');

}