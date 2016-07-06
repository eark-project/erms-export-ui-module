angular
    .module('eArkPlatform.erms.repoView', [])
    .config(config);

function config($stateProvider, languageFilesProvider ){

    $stateProvider.state('erms.repoView', {
        url: '/erms-repoView',
        views: {
            'erms-modules-view': {
                templateUrl : 'app/src/erms/modules/profiles/view/repoView.html',
                controller : 'ErmsRepoViewController',
                controllerAs: 'evc'
            }
        }
    });

    languageFilesProvider.addFile('app/src/erms/modules/repoView/i18n/','-repoView.json');
    ermsServiceProvider.addERMSModule('ERMS.REPO_VIEW.MENU.LABEL.BROWSE_REPO','erms.repoView','storage');


}