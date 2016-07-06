angular
    .module('eArkPlatform.header')
    .provider('modulesMenuService', modulesMenuServiceProvider);

/**
 * for injecting items into the header bar. Any module wishing to inject a menu item into the main header ber must
 * call this
 */
function modulesMenuServiceProvider() {
    var items = [];
    this.addItem = addItem;
    this.$get = modulesMenuService;

    function addItem(item) {
        items.push(item);
        return this;
    }

    function modulesMenuService() {
        return {
            getItems: getItems
        };

        function getItems() {
            return items;
        }
    }
}