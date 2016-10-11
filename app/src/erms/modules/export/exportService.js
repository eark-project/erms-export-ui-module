angular
    .module('eArkPlatform.erms.export')
    .factory('ermsExportService', ErmsExportService);

function ErmsExportService($http, errorService, $translate, $mdToast) {

    var exportBasket = [], exclusionList = [];
    var exportProfile = '', exportMap='';

    return {
        getBasket           : getBasket,
        itemExists          : itemExists,
        removeItem          : removeItem,
        exportItems         : exportItems,
        clearBasket         : clearBasket,
        checkExportStatus   : checkExportStatus,
        itemDeselected      : itemDeselected,
        deSelectItem        : deSelectItem,
        toggleItemInBasket  : toggleItemInBasket,
        initExportParams    : initExportParams,
        uploadEAD           : uploadEAD,
        getBasketLength     : getBasketLength
    };

    function initExportParams(profileName, mapName){
        exportProfile = profileName;
        exportMap = mapName;
    }

    function getBasket() {
        return exportBasket;
    }

    function removeItem(item){
        _removeItem(item, exportBasket);
    }

    function exportItems(){
        console.log("The number of items to be exported is:" + exportBasket.length +"\nThe number of items to exclude: "+exclusionList.length);
        return $http.post('/webapi/extraction/extract', {
            name: exportProfile,
            mapName : exportMap,
            exportList: _getItemIds(exportBasket),
            excludeList: _getItemIds(exclusionList)
        });
    }

    /**
     * Serves to add an item to the exclusion list
     * @param item
     */
    function deSelectItem(item){
        if(exclusionList.length <=0)
            exclusionList = [item];
        else exclusionList.push(item);
    }

    /**
     * Checks if an item is in the basket. If the item exists, it is removed otherwise added to the basket.
     * @param item
     */
    function toggleItemInBasket(item) {
        if(item.selected == true){
            item.selected = false;
            //check the export basket first
            if(itemExists(item))
                removeItem(item);
            //otherwise it's a child of an export root and we simply want to place it in the exclusion basket
            else
                deSelectItem(item);
        }
        else{ //It's either an export root or something we want to reselect from the exclusion list
            item.selected = true;
            //check if it's in the exclusion list them remove it
            if(itemDeselected(item))
                _removeItem(item, exclusionList);
            else{
                try{
                    exportBasket.push(item);
                }
                catch(err){
                    console.log("Unable to add the item to the basket so it must be empty. Initialising new export basket");
                    exportBasket = [item];
                }
            }
        }

    }

    /**
     * Returns a boolean indicating whether the item is already in the export basket
     * @param item
     * @returns {true|false}
     */
    function itemExists(item) {
        return _getItemPos(item, exportBasket) >= 0;
    }

    /**
     * Checks whether item is in deselection basket. returns true if it is
     * @param item
     * @returns {true|false}
     */
    function itemDeselected(item) {
        return _getItemPos(item, exclusionList) >= 0;
    }

    /**
     * Clears both the export basket and the exclusion list
     */
    function clearBasket(){
        exportBasket = [];
        exclusionList = [];
    }

    function uploadEAD(eadFileObject){
        var formData = new FormData();
        formData.append('file', eadFileObject.file);
        formData.append('eadFile', eadFileObject.file.name);
        return $http.post('/webapi/extraction/ead/upload', formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(
            function (response) {
                console.log(response.data);
                return response.data;    
            },
            function (response) {
                errorService.displayErrorMsg( $translate.instant('COMMON.ERROR') );
            }
        );
    }

    function checkExportStatus(){
        console.log("Checking export status");
        return $http.get('/webapi/extraction/status').then(function(response){
            return response.data;
        });
    }
    
    function getBasketLength() {
        return exportBasket.length;
    }

    /**
     *
     * @param item the item to be removed
     * @param basket the basket from which to remove the item
     * @private
     */
    function _removeItem(item, basket) {
        var idx = _getItemPos(item, basket);
        if (idx >= 0) {
            basket.splice(idx, 1);
        }
    }

    /**
     * Returns the index of the item in the specified basket
     * @param item
     * @param basket
     * @private
     * @returns position of the item in the flat array or -1 indicating it doesn't exist
     */
    function _getItemPos(item, basket) {
        if (basket.length <= 0)
            return -1;

        return basket.map(function (o) {
            return o.objectId
        }).indexOf(typeof item ==  'object' ? item.objectId : item);

    }

    /**
     * Returns a flat array of item id strings from the given basket
     * @param basket
     * @returns {Array}
     * @private
     */
    function _getItemIds(basket){
        var flatList = [];
        basket.forEach(function(item){
            flatList.push(item.objectId);
        });
        return flatList;
    }
}
