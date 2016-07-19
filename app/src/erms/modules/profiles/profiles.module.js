angular
    .module('eArkPlatform.erms.profile', ['pascalprecht.translate'])
    .config(config);

function config($stateProvider, languageFilesProvider, ermsServiceProvider ){

    $stateProvider.state('erms.profiles', {
        url: '/erms-profile',
        views: {
            'erms-modules-view': {
                templateUrl : 'app/src/erms/modules/profiles/view/profilesView.html',
                controller : 'ErmsProfilesController',
                controllerAs: 'empc'
            }
        }
    });

    languageFilesProvider.addFile('app/src/erms/modules/profiles/i18n/','-profiles.json');
    ermsServiceProvider.addERMSModule('ERMS_PROFILES.PROFILES.MENU.LABEL.PROFILES','erms.profiles','list');


}