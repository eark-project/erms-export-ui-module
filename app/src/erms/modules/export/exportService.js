angular
    .module('eArkPlatform.erms.export')
    .factory('ermsExportService', ErmsExportService);

function ErmsExportService() {

    var exportBasket = [], exclusionList = [];

    return {
        getBasket           : getBasket,
        itemExists          : itemExists,
        removeItem          : removeItem,
        clearBasket         : clearBasket,
        itemDeselected      : itemDeselected,
        deSelectItem        : deSelectItem,
        toggleItemInBasket  : toggleItemInBasket
    };

    function getBasket() {
        return exportBasket;
    }

    function removeItem(item){
        _removeItem(item, exportBasket);
    }

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
     * Returns a boolean indicating whether the item is already in the basket
     * @param item
     * @returns {boolean}
     */
    function itemExists(item) {
        return _getItemPos(item, exportBasket) >= 0;
    }

    /**
     * check whether item is in deselection basket
     * @param item
     * @returns {boolean}
     */
    function itemDeselected(item) {
        return _getItemPos(item, exclusionList) >= 0;
    }

    /**
     * removes an item from the basket
     * @param item
     * @private
     */
    function _removeItem(item, basket) {
        var idx = _getItemPos(item, basket);
        if (idx >= 0) {
            basket.splice(idx, 1);
        }
    }

    /**
     * returns the index of the item in the basket
     * @param item
     * @param basket
     * @private
     * @returns number of item in the flat array or -1 indicating it doesn't exist
     */
    function _getItemPos(item, basket) {
        if (basket.length <= 0)
            return -1;

        return basket.map(function (o) {
            return o.objectId
        }).indexOf(typeof item ==  'object' ? item.objectId : item);

    }

    function clearBasket(){
        exportBasket = [];
    }
}
