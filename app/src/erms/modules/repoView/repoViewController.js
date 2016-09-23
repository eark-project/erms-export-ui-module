angular
    .module('eArkPlatform.erms.repoView')
    .controller('RepoViewController', RepoViewController);

function RepoViewController($scope, $stateParams, ermsRepoService, fileUtilsService, ermsExportService) {
    var rvc = this;
    rvc.repo = ermsRepoService.repoItems;
    rvc.mapName = "";
    rvc.profileName = "";
    rvc.loadRepoView = loadRepoView;
    rvc.isFile = isFile;
    rvc.getItem = getItem;
    rvc.breadcrumbs = ermsRepoService.breadcrumbs;
    rvc.gotoCrumb = ermsRepoService.goToCrumb;
    rvc.selectItemForExport = selectItemForExport;

    rvc.loadRepoView();

    /**
     *  This function will load the root folder view. Triggered when a profile is selected.
     *
     * @param profileName Misleadingly, can be either the profile name or the object Id of the folder
     */
    function loadRepoView(){
        ermsRepoService.registerObserverCallback(repoViewObserver);
        ermsRepoService.setProfile(decodeURIComponent($stateParams.profileName), decodeURIComponent($stateParams.mapName));
        rvc.profileName = ermsRepoService.profile;
        rvc.repositoryRoot = ermsRepoService.repositoryRoot;
        rvc.mapName = ermsRepoService.mapName;
        //load the root view for the repository
        _getRootView(rvc.profileName);
        //Re-initialise the export feature by clearing the export basket and re-initialising the profile and mapping params
        //ermsExportService.clearBasket();
        ermsExportService.initExportParams(ermsRepoService.profile, ermsRepoService.mapName);

    }

    /**
     * Returns the view for the repository root which also (can) include the repository information should one wish.
     * (would require changing the return from the ermsRepoService to return response.data)
     * @param profileName
     * @private
     */
    function _getRootView(){
        ermsRepoService.connect();
    }

    /**
     * Request folder children for view
     * @param objectId
     * @private
     */
    function _getFolderView(item){
        var requestObject = {
            name: rvc.profileName,
            folderObjectId: item.objectId,
            selected: item.selected
        };
        ermsRepoService.getFolderChildren(requestObject);
    }

    /**
     * Returns all the information about a document
     * @param objectId
     * @private
     */
    function _getDocument(objectId){
        var requestObject = {
            name: rvc.profileName,
            documentObjectId: objectId
        };
        ermsRepoService.getDocument(requestObject).then(function(response){
            rvc.document = response;
            rvc.document.displaySize = fileUtilsService.formatBytes(response.properties.size);
        });
    }

    /**
     * Just returns whether the item is a document or folder
     * @param item
     * @returns {boolean}
     */
    function isFile(item){
        return item.type === "document";
    }

    /**
     * Decides which to call between getting information on a document or a folder.
     * @param item
     */
    function getItem(item){
        (item.type === 'folder') ? _getFolderView(item) : _getDocument(item);
    }

    /**
     * Returns the current path based on the breadcrumbs
     * @private
     */
    function _getBreadcrumbPath(){
        var path = "";
        rvc.breadcrumbs.forEach(function(item){
            path += "/"+item.name;
        });
        return path;
    }

    function selectItemForExport(item){
        ermsExportService.toggleItemInBasket(item);
    }

    /**
     * Re-assigns the repo view array on changes to objects in the array
     */
    function repoViewObserver(){
        rvc.breadcrumbs = ermsRepoService.breadcrumbs;
        rvc.repo = ermsRepoService.repoItems;
    }
}