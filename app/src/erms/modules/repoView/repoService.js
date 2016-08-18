angular
    .module('eArkPlatform.erms.repoView')
    .service('ermsRepoService', ermsRepoService);

function ermsRepoService($q, $http, fileUtilsService, ermsExportService) {

    var ermsSvc = this;
    ermsSvc.observerCallbacks = [];
    ermsSvc.breadcrumbs = [];
    ermsSvc.repoItems = [];
    ermsSvc.profile = "";
    //methods
    ermsSvc.connect = connect;
    ermsSvc.initRepoView = initRepoView;
    ermsSvc.getFolderChildren = getFolderChildren;
    ermsSvc.getDocument = getDocument;
    ermsSvc.setProfile = setProfile;
    ermsSvc.goToCrumb = goToCrumb;

    /**
     * Returns the properties of the root folder of a profile repository along with its children.
     * This should only really be called when clicking on the profile name in the view or the root in the breadcrumb
     * trail.
     * @param profileName
     * @returns {*}
     */
    function connect() {
        return $http.post('http://localhost:9090/webapi/repository/connect', {profileName: ermsSvc.profile}).then(function (response) {
            ermsSvc.breadcrumbs = [];
            initRepoView(response.data.rootFolder);
        });
    }

    /**
     * Will return the properties of a folder and its children pretty much in the same format as the connect function
     * @param requestObject
     * @returns {*}
     */
    function getFolderChildren(requestObject) {
        return $http.post('http://localhost:9090/webapi/repository/getFolder', requestObject).then(function (response) {
            initRepoView(response.data.folder);
        });
    }

    /**
     * Will return the properties of a document and, optionally, it's content stream.
     * @param requestObject object constructed thus {profileName:[a profile name], objectId:[documentObjectId, includeContentStream:false/true}
     * @returns {*}
     */
    function getDocument(requestObject) {
        return $http.post('http://localhost:9090/webapi/repository/getDocument', requestObject).then(function (response) {
            return response.data.document;
        });
    }

    function setProfile(profileName) {
        ermsSvc.profile = profileName;
        ermsSvc.repoItems = [];
        ermsSvc.notifyObservers();

    }

    /**
     * Adds resource path for the icon matching the mimetype property to the json object of everything in the rvc.repo
     * array.
     */
    function _addThumbnailUrl(repoItems) {
        var mimeTypeProperty = 'contentStreamMimeType';
        repoItems.children.forEach(function (item) {
            if (item.type === 'folder') {
                item.thumbNailURL = fileUtilsService.getFolderIcon(24);
            } else {
                item.thumbNailURL = fileUtilsService.getFileIconByMimetype(item[mimeTypeProperty], 24);
            }
        });
    }

    /**
     * Initialises the view used for displaying folder children in the view
     * @param response
     */
    function initRepoView(response) {
        ermsSvc.repoItems = response;
        ermsSvc.repoItems.empty = (!ermsSvc.repoItems.children === Array || ermsSvc.repoItems.children.length == 0);
        if (!ermsSvc.repoItems.empty) {
            _addThumbnailUrl(ermsSvc.repoItems);
            ermsSvc.repoItems.children.forEach(function (item) {
                if (item.type == 'document')
                    item.displaySize = fileUtilsService.formatBytes(item.size);
                (ermsExportService.itemExists(item)) ? item.selected = true : item.selected = false;

            })
        }
        var crumb = {
            name: ermsSvc.repoItems.properties.name,
            objectId: ermsSvc.repoItems.properties.objectId
        };
        if(ermsSvc.repoItems.children.length <= 0)
            ermsSvc.breadcrumbs = [crumb];
        else
            ermsSvc.breadcrumbs.push(crumb);

        ermsSvc.notifyObservers();
    }

    /**
     * Changes the view to the level selected in the breadcrumb
     * @param index
     */
    function goToCrumb(index) {
        var selected = ermsSvc.breadcrumbs[index];
        ermsSvc.breadcrumbs = ermsSvc.breadcrumbs.slice(0, index);
        (index == 0) ? ermsSvc.connect() : ermsSvc.getFolderChildren({
            profileName: ermsSvc.profile,
            folderObjectId: selected.objectId
        });
    }

    function registerSelection(item, all){
        if(all && !item)
            ermsSvc.repoItems.forEach(function(item){
                item.seletced = false;
            });
        if(item && !all){
            var idx = _getItemPos(item);
            ermsSvc.repoItems.splice(idx,1);
        }
    }


    /**
     * returns the index of the item in the basket
     * @param item
     * @private
     * @returns number of item in the flat array or -1 indicating it doesn't exist
     */
    function _getItemPos(item) {
        if (ermsSvc.repoItems.length <= 0)
            return -1;
        else
            return ermsSvc.repoItems.map(function (o) {
                return o.objectId
            }).indexOf(item.objectId);
    }

    //register an observer
    ermsSvc.registerObserverCallback = function(callback){
        ermsSvc.observerCallbacks.push(callback);
    };

    //call this when repoItems has been changed
    ermsSvc.notifyObservers = function(){
        angular.forEach(ermsSvc.observerCallbacks, function(callback){
            callback();
        });
    };

}
