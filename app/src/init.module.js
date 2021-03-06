angular
    .module('eArkPlatform.init', ['ngMaterial'])
    .constant('PATTERNS', {
        fileName: /^[a-zA-Z0-9_\-,!@#$%^&()=+ ]+$/,
        phone: /^[+]?[0-9\- ]+$/
    })
    .constant('APP_CONFIG', {
        appName: 'ERMS-Export',
        logoSrc: './app/assets/images/logo.gif'
    })
    .filter('urlEncode', function(){
        return function(input){
            if (input)
                return window.encodeURIComponent(input)

            return "";
        }
    });