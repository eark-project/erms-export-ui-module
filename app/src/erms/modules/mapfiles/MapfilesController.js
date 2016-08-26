angular
    .module('eArkPlatform.erms.mapfiles')
    .controller('ErmsMapfilesController', ErmsMapfilesController);

function ErmsMapfilesController($state, $mdDialog, ermsMapfilesService) {
    var emfc = this;

    emfc.mapfiles = ermsMapfilesService.getMapFiles();


    emfc.addMapFile = function (ev) {
        $mdDialog.show({
            controller: AddMapFileDialogController,
            templateUrl: 'app/src/erms/modules/mapfiles/view/addMapfilesDialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            locals: {
                mapfiles: emfc.mapfiles
            }
        });
    };

    emfc.delMapFile = function (file) {
        ermsMapfilesService.delMapFile(file);
    };

    function AddMapFileDialogController($scope, $mdDialog, mapfiles, ermsMapfilesService) {
        var file = {};
        $scope.mapping = {
            file: null,
            mappingName: null
        };
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.upload = function () {
            ermsMapfilesService.addMapFile($scope.mapping);
            $mdDialog.hide();
        };
        $scope.fileNameChanged = function (el) {
            file = el.files[0];
        };
    }

}