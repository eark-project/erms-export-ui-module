angular
    .module('eArkPlatform.erms', ['ngMaterial', 'pascalprecht.translate'])
    .config(config);

function config(modulesMenuServiceProvider, $stateProvider, languageFilesProvider, $translateProvider) {
    /**
     * Inject a menuItem into the platform header area
     */
    modulesMenuServiceProvider.addItem({
        templateUrl: 'app/src/erms/view/menuItem.html',
        order: 2
    });

    /**
     * Inject the modules translation files
     */
    languageFilesProvider.addFile('app/src/erms/i18n/','-erms.json');

    $stateProvider.state('erms', {
        parent: 'site',
        url: '/erms',
        views: {
            'content@': {
                templateUrl: 'app/src/erms/view/erms.html',
                controller: 'ErmsMenuController',
                controllerAs: 'emc'
            }
        }
    });

    $translateProvider.forceAsyncReload(true);
}