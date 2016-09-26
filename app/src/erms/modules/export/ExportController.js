angular
    .module('eArkPlatform.erms.export')
    .controller('ErmsExportController', ErmsExportController)
    .controller('ErmsExportProcessController', ErmsExportProcessController);

function ErmsExportController($state, ermsExportService, $mdDialog, errorService) {
    var rxc = this;

    rxc.exportItems = [];
    rxc.removeItem = removeItem;
    rxc.initExport = initExport;

    loadBasket();

    function loadBasket() {
        rxc.exportItems = ermsExportService.getBasket();
    }

    function removeItem(item) {
        ermsExportService.removeItem(item);
        loadBasket();
    }

    /**
     * Initiates an export process
     */
    function initExport() {
        return $mdDialog.show({
            controller: selectTemplateDialogController,
            controllerAs: 'stdc',
            templateUrl: 'app/src/erms/modules/export/view/selectTemplateDialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            focusOnOpen: true

        }).then(function (response) {
            $state.go('erms.export');
            ermsExportService.exportItems().then(function (response) {
                console.log(response.data);
            });

        });
    }

    function selectTemplateDialogController($scope, $mdDialog) {
        var stdc = this;
        var file = {};
        stdc.eadFile = {
            file: null,
            fileName: null
        };
        stdc.cancel = function () {
            $mdDialog.cancel();
        };
        stdc.upload = function () {
            $mdDialog.hide();
            ermsExportService.uploadEAD(stdc.eadFile).then(function (response) {
                if (response.success) {
                    errorService.displayErrorMsg('EAD file was successfully validated. Proceeding with export.');
                }
            });
        };
        $scope.fileNameChanged = function (el) {
            file = el.files[0];
        };
    }
}

function ErmsExportProcessController(ermsExportService, errorService, $state, $timeout, $interval){
    var rxpc = this;
    $interval(checkStatus, 10000);

    function checkStatus() {
        ermsExportService.checkExportStatus().then(statusResponse);
    }

    function statusResponse(response){
        console.log(response.status);
        if(response.status == 'DONE'){
            $interval.cancel(checkStatus);
            errorService.displayErrorMsg(response.message ? response.message : response.error);
            $timeout(function(){
                $state.go('dashboard');
            }, 15000);
        }
        if(response.status == 'NOT_RUNNING'){
            $interval.cancel(checkStatus);
            errorService.displayErrorMsg("There are no exports running.");
            $state.go('erms');$timeout(function(){
                $state.go('erms');
            }, 5000);
        }
        if(!angular.isDefined(response.status)){
            $interval.cancel(checkStatus);
            errorService.displayErrorMsg("Something went wrong with the export. Please contact systems administrator.");
            $state.go('erms');$timeout(function(){
                $state.go('erms');
            }, 5000);
        }
    }
}

