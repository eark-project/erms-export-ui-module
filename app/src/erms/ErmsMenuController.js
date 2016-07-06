angular
    .module('eArkPlatform.erms')
    .controller('ErmsMenuController', ErmsMenuController);

function ErmsMenuController($scope, ermsService) {
    var emc = this;
    emc.modules = ermsService.getModules();
}