angular
    .module('eArkPlatform.erms.export')
    .controller('ErmsExportController', ErmsExportController);

function ErmsExportController($state, ermsExportService, $mdDialog) {
    var rxc = this;

    rxc.exportItems = [];
    rxc.removeItem = removeItem;
    rxc.initExport = initExport;

    loadBasket();

    function loadBasket(){
        rxc.exportItems = ermsExportService.getBasket();
    }

    function removeItem(item){
        ermsExportService.removeItem(item);
        loadBasket();
    }

    
    /**
     * Initiates an export process
     */
    
    function initExport(){
        
        return $mdDialog.show({
            
            controller: selectTemplateDialogController,
            controllerAs: 'stdc',
            templateUrl: 'app/src/erms/modules/export/view/selectTemplateDialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            focusOnOpen: true
            
        }).then(function () {
            
            $state.go('erms.export');
            ermsExportService.exportItems().then(function(response){
                console.log(response.data);
            });
            
        });
    }
    
    function selectTemplateDialogController($mdDialog) {
      
        var stdc = this;
        
        stdc.selectTemplate = function () {
            // Do something with file from form
            $mdDialog.hide();
        };
        
        stdc.cancel = function () {
            $mdDialog.cancel();
        };
            
    }

}

