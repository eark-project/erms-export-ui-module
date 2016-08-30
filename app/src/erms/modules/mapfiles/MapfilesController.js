angular
    .module('eArkPlatform.erms.mapfiles')
    .controller('ErmsMapfilesController', ErmsMapfilesController);

function ErmsMapfilesController($state, $mdDialog, ermsMapfilesService) {
    
    var emfc = this;
    
    emfc.mapfiles = [];

    function initialiseMappings() {
        ermsMapfilesService.getMapFiles().then(function (response) {
            emfc.mapfiles = response;
        });
    }

    initialiseMappings();

    console.log(emfc.mapfiles);
    
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
        ermsMapfilesService.delMapFile(file).then(function (response){
            console.log(response.message);
            initialiseMappings();
        });
    };

    function AddMapFileDialogController($scope, $mdDialog, ermsMapfilesService) {
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
            $mdDialog.hide();
            ermsMapfilesService.addMapFile($scope.mapping).then(function(response){
                initialiseMappings();
            });
        };
        $scope.fileNameChanged = function (el) {
            file = el.files[0];
        };
    }

}