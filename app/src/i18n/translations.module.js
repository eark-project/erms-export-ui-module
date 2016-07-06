angular.module('eArkPlatform.translations.init', []);

angular.module('eArkPlatform.translations', ['pascalprecht.translate'])
    .factory('availableLanguages', AvailableLanguages)
    .config(config);

var availableLanguages = {
    keys: ['en', 'da'],
    localesKeys: {
        'en_GB': 'en',
        'en_US': 'en',
        'da_DK': 'da'
    }
};

function AvailableLanguages() {
    return availableLanguages;
}

function config($translateProvider, languageFilesProvider) {
    languageFilesProvider.addFile('app/src/i18n/', '.json');
    $translateProvider.useStaticFilesLoader(languageFilesProvider.getLanguageFiles());

    $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
    $translateProvider
        .registerAvailableLanguageKeys(availableLanguages.keys, availableLanguages.localesKeys)
        .determinePreferredLanguage();

    //set default language if browsers langugage not found
    if (availableLanguages.keys.indexOf($translateProvider.preferredLanguage()) === -1) {
        $translateProvider.preferredLanguage(availableLanguages.keys[0]);
    }

    //Force a refresh of the translation because of a verified race condition issue
    //See: http://stackoverflow.com/a/31836226
    $translateProvider.forceAsyncReload(true);

}