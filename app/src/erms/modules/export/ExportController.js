angular
    .module('eArkPlatform.erms.export')
    .controller('ErmsExportController', ErmsExportController);

function ErmsExportController(ermsExportService) {
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
        ermsExportService.exportItems().then(function(response){
            console.log(response.data);
        });
    }

}