angular
    .module('eArkPlatform.erms.export')
    .controller('ErmsExportController', ErmsExportController)
    .controller('ErmsExportProcessController', ErmsExportProcessController);

function ErmsExportController($state, ermsExportService, $mdDialog, errorService, $mdToast, $translate) {
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
        }).then(
            function (response) {
                console.log('dialog validate in order');
                $state.go('erms.export');
                ermsExportService.exportItems().then(function (response) {
                    $mdToast.showSimple(response.data.message);
                });
            },
            function (response) {
                console.log('dialog validate NOT in order');
            }
        );
    }

    function selectTemplateDialogController($scope, $mdDialog, errorService, $mdToast) {
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
            ermsExportService.uploadEAD(stdc.eadFile).then(
                function (response) {
                    if (!response.success) {
                        errorService.displayErrorMsg( $translate.instant('ERMS_EXPORT.MESSAGES.EAD_INVALID_DESC') );
                        return false;
                    } else {
                        $mdToast.showSimple( $translate.instant('ERMS_EXPORT.MESSAGES.EAD_VALID') );
                    };
                }, function (response) {
                    errorService.displayErrorMsg( $translate.instant('ERMS_EXPORT.MESSAGES.EAD_INVALID') );
                    return false;
                }
            );
        };
    }
}

function ErmsExportProcessController(ermsExportService, errorService, $state, $timeout, $interval, $mdToast, $translate){
    var rxpc = this;
    rxpc.exportResponse = '';
    rxpc.exportStatus = 'NOT_RUNNING';
    
    var checking = $interval(checkStatus, 10000);

    function checkStatus() {
        ermsExportService.checkExportStatus().then(statusResponse);
    }

    function statusResponse(response){
        
        rxpc.exportStatus = response.status;
        
        if(response.status == 'NOT_RUNNING'){
            rxpc.exportResponse = $translate.instant('ERMS_EXPORT.MESSAGES.NOT_RUNNING');
            $interval.cancel(checking);
        };
        if(response.status == 'RUNNING'){
            rxpc.exportResponse = $translate.instant('ERMS_EXPORT.MESSAGES.RUNNING');
        };
        if(response.status == 'DONE'){
            rxpc.exportResponse = response.path;
            $interval.cancel(checking);
            //errorService.displayErrorMsg(response.message ? response.message : response.error);
        };
        if (angular.isDefined(response.error)) {
            rxpc.exportResponse = response.error;
            $interval.cancel(checking);
        }
        if(!angular.isDefined(response.status)){
            errorService.displayErrorMsg( $translate.instant('ERMS_EXPORT.MESSAGES.SOMETHING_WRONG') );
            rxpc.exportResponse = $translate.instant('ERMS_EXPORT.MESSAGES.SOMETHING_WRONG') + ' ' + $translate.instant('ERMS_EXPORT.MESSAGES.CONTACT_SYSADM');
            $interval.cancel(checking);
        };
        
    }
    
}

