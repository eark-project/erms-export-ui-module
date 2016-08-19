angular
    .module('eArkPlatform.erms.export')
    .factory('ermsExportService', ErmsExportService);

function ErmsExportService() {

    var exportBasket = [];

    return {
        getBasket           : getBasket,
        itemExists          : itemExists,
        clearBasket         : clearBasket,
        toggleItemInBasket  : toggleItemInBasket
    };

    function getBasket() {
        return exportBasket;
    }

    /**
     * Checks if an item is in the basket. If the item exists, it is removed otherwise added to the basket.
     * @param item
     */
    function toggleItemInBasket(item) {
        //Check if it's empty
        if (exportBasket.length > 0) {
            //check if it exists
            if (!itemExists(item)) {
                item.selected = true;
                exportBasket.push(item); //if it doesn't add it to the array
            }
            else {
                item.selected = true;
                _removeItem(item); //else if it does then we must want to remove the item
            }
        }
        else {
            item.selected = true;
            exportBasket = [item];//if it's empty initialise a new array with the item
        }
    }

    /**
     * Returns a boolean indicating whether the item is already in the basket
     * @param item
     * @returns {boolean}
     */
    function itemExists(item) {
        return _getItemPos(item) >= 0;
    }

    /**
     * removes an item from the basket
     * @param item
     * @private
     */
    function _removeItem(item) {
        var idx = _getItemPos(item);
        if (idx >= 0) {
            exportBasket.splice(idx, 1);
        }
    }

    /**
     * returns the index of the item in the basket
     * @param item
     * @private
     * @returns number of item in the flat array or -1 indicating it doesn't exist
     */
    function _getItemPos(item) {
        if (exportBasket.length <= 0)
            return -1;
        else
            return exportBasket.map(function (o) {
                return o.objectId
            }).indexOf(item.objectId);
    }

    function clearBasket(){
        exportBasket = [];
    }
}
