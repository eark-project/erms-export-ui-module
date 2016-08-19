angular
    .module('eArkPlatform.erms.export')
    .controller('ErmsExportController', ErmsExportController);

function ErmsExportController(ermsExportService) {
    var rxc = this;

    rxc.exportItems = [];
    rxc.removeItem = removeItem;

    loadBasket();

    function loadBasket(){
        rxc.exportItems = ermsExportService.getBasket();
    }

    function removeItem(item){

    }

}