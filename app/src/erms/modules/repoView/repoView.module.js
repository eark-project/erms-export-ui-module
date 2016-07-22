angular
    .module('eArkPlatform.erms.repoView', [])
    .config(config);

function config($stateProvider, languageFilesProvider ){

    $stateProvider.state('erms.repos.browseRepo', {
        parent: 'erms.repos',
        url: '/repo-browser',
        views: {
            'repo-browser': {
                templateUrl : 'app/src/erms/modules/repoView/view/repoView.html'
            }
        }
    });

    languageFilesProvider.addFile('app/src/erms/modules/repoView/i18n/','-repoView.json');

}