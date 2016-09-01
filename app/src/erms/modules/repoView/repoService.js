angular
    .module('eArkPlatform.erms.repoView')
    .service('ermsRepoService', ermsRepoService);

function ermsRepoService($q, $http, fileUtilsService, ermsExportService) {

    var ermSvc = this;
    ermSvc.observerCallbacks = [];
    ermSvc.breadcrumbs = [];
    ermSvc.repoItems = [];
    ermSvc.profile = "";
    //methods
    ermSvc.connect = connect;
    ermSvc.initRepoView = initRepoView;
    ermSvc.getFolderChildren = getFolderChildren;
    ermSvc.getDocument = getDocument;
    ermSvc.setProfile = setProfile;
    ermSvc.goToCrumb = goToCrumb;

    /**
     * Returns the properties of the root folder of a profile repository along with its children.
     * This should only really be called when clicking on the profile name in the view or the root in the breadcrumb
     * trail.
     * @param profileName
     * @returns {*}
     */
    function connect() {
        return $http.post('/webapi/repository/connect', {
                    name: ermSvc.profile, 
                    repositoryRoot: ermSvc.repositoryRoot,
                    mapName: ermSvc.mapName}).then(function (response) {
            ermSvc.breadcrumbs = [];
            initRepoView(response.data.rootFolder);
        });
    }

    /**
     * Will return the properties of a folder and its children pretty much in the same format as the connect function
     * @param requestObject
     * @returns {*}
     */
    function getFolderChildren(requestObject) {
        return $http.post('/webapi/repository/getFolder', requestObject).then(function (response) {
            initRepoView(response.data.folder);
        });
    }

    /**
     * Will return the properties of a document and, optionally, it's content stream.
     * @param requestObject object constructed thus {profileName:[a profile name], objectId:[documentObjectId, includeContentStream:false/true}
     * @returns {*}
     */
    function getDocument(requestObject) {
        return $http.post('/webapi/repository/getDocument', requestObject).then(function (response) {
            return response.data.document;
        });
    }

    function setProfile(profileName, repositoryRoot, mapName) {
        ermSvc.mapName = mapName;
        ermSvc.profile = profileName;
        ermSvc.repositoryRoot = repositoryRoot;
        ermSvc.repoItems = [];
        ermSvc.notifyObservers();

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
        ermSvc.repoItems = response;
        ermSvc.repoItems.empty = (!ermSvc.repoItems.children === Array || ermSvc.repoItems.children.length == 0);
        if (!ermSvc.repoItems.empty) {
            _addThumbnailUrl(ermSvc.repoItems);
            ermSvc.repoItems.children.forEach(function (item) {
                if (item.type == 'document')
                    item.displaySize = fileUtilsService.formatBytes(item.size);
                (ermsExportService.itemExists(item)) ? item.selected = true : item.selected = false;

            })
        }
        var crumb = {
            name: ermSvc.repoItems.properties.name,
            objectId: ermSvc.repoItems.properties.objectId
        };
        if(ermSvc.repoItems.children.length <= 0)
            ermSvc.breadcrumbs = [crumb];
        else
            ermSvc.breadcrumbs.push(crumb);

        ermSvc.notifyObservers();
    }

    /**
     * Changes the view to the level selected in the breadcrumb
     * @param index
     */
    function goToCrumb(index) {
        var selected = ermSvc.breadcrumbs[index];
        ermSvc.breadcrumbs = ermSvc.breadcrumbs.slice(0, index);
        (index == 0) ? ermSvc.connect() : ermSvc.getFolderChildren({
            profileName: ermSvc.profile,
            folderObjectId: selected.objectId
        });
    }

    function registerSelection(item, all){
        if(all && !item)
            ermSvc.repoItems.forEach(function(item){
                item.seletced = false;
            });
        if(item && !all){
            var idx = _getItemPos(item);
            ermSvc.repoItems.splice(idx,1);
        }
    }


    /**
     * returns the index of the item in the basket
     * @param item
     * @private
     * @returns number of item in the flat array or -1 indicating it doesn't exist
     */
    function _getItemPos(item) {
        if (ermSvc.repoItems.length <= 0)
            return -1;
        else
            return ermSvc.repoItems.map(function (o) {
                return o.objectId
            }).indexOf(item.objectId);
    }

    //register an observer
    ermSvc.registerObserverCallback = function(callback){
        ermSvc.observerCallbacks.push(callback);
    };

    //call this when repoItems has been changed
    ermSvc.notifyObservers = function(){
        angular.forEach(ermSvc.observerCallbacks, function(callback){
            callback();
        });
    };

}
