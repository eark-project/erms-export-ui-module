angular
    .module('eArkPlatform.erms.mapfiles')
    .controller('ErmsMapfilesController', ErmsMapfilesController);

function ErmsMapfilesController($state, $mdDialog, ermsMapfilesService, $translate, $mdToast) {
    
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
    }

    emfc.delMapFile = function (ev, file) {
        var confirm = $mdDialog.confirm()
              .title( $translate.instant('COMMON.CONFIRM') )
              .textContent( $translate.instant('ERMS_MAPS.MSG.DEL_MAP') )
              .ariaLabel( $translate.instant('COMMON.DELETE') + ' ' + $translate.instant('ERMS_MAPS.MAPPINGS.DIALOG.LABELS.MAPPING_FILE') )
              .targetEvent(ev)
              .ok( $translate.instant('COMMON.DELETE', { mapfilename: file.name }) )
              .cancel( $translate.instant('COMMON.CANCEL') );
    
        $mdDialog.show(confirm).then(function() {
            ermsMapfilesService.delMapFile(file).then(function (response){
                console.log(response.message);
                $mdToast.showSimple( $translate.instant('ERMS_MAPS.MSG.MAP_DELETED') );
                initialiseMappings();
            });
        }, function() {
            console.log('Cancel delete');
        });
    }

    function AddMapFileDialogController($scope, $mdDialog, ermsMapfilesService, errorService, $translate, $mdToast) {
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
            ermsMapfilesService.addMapFile($scope.mapping).then(
                function(response){
                    if (!response.success) {
                        errorService.displayErrorMsg( $translate.instant('ERMS_MAPS.MSG.XML_NOT_VALID') );
                    } else {
                        $mdToast.showSimple( $translate.instant('ERMS_MAPS.MSG.MAP_VALID') );
                        initialiseMappings();
                    };
                },
                function(response) {
                    errorService.displayErrorMsg( $translate.instant('COMMON.ERROR') );
                }
            );
        };
        $scope.fileNameChanged = function (el) {
            file = el.files[0];
        };
    }

}