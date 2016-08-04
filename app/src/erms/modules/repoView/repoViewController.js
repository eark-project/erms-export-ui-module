angular
    .module('eArkPlatform.erms.repoView')
    .controller('RepoViewController', RepoViewController);

function RepoViewController($stateParams, ermsRepoService, fileUtilsService) {
    var rvc = this;
    rvc.repo = null;
    rvc.profileName = decodeURIComponent($stateParams.profileName);
    rvc.loadRepoView = loadRepoView;
    rvc.isFile = isFile;
    rvc.getItem = getItem;
    rvc.breadcrumbs = [];
    rvc.gotoCrumb = goToCrumb;

    rvc.loadRepoView();

    /**
     *  This function will either load the root folder view or the contents of the folder requested.
     *
     * @param profileName Misleadingly, can be either the profile name or the object Id of the folder
     */
    function loadRepoView(){
        rvc.breadcrumbs = [];
        _getRootView(rvc.profileName);
    }

    function goToCrumb(index) {
        var selected = rvc.breadcrumbs[index];
        rvc.breadcrumbs = rvc.breadcrumbs.slice(0, index);
        (index == 0) ? _getRootView(rvc.profileName) : _getFolderView(selected.objectId);
    }

    function _getRootView(profileName){
        ermsRepoService.connect(profileName).then(function(response){
            rvc.repo = response;
            //Check if the repository root is empty
            rvc.repo.empty = (!rvc.repo.children === Array || rvc.repo.children.length == 0);
            if(!rvc.repo.empty) {
                addThumbnailUrl();
                rvc.repo.children.forEach(function(item){
                    if(item.type == 'document')
                        item.displaySize = formatBytes(item.size);
                })
            }
            rvc.breadcrumbs=[{name:rvc.repo.properties.name, objectId:rvc.repo.properties.objectId}];
        });
    }

    function _getFolderView(objectId){
        var requestObject = {
            profileName: rvc.profileName,
            folderObjectId: objectId
        };
        ermsRepoService.getFolderChildren(requestObject).then(function(response){
            rvc.repo = response;
            //Check if the folder is empty
            rvc.repo.empty = (!rvc.repo.children === Array || rvc.repo.children.length == 0);
            if(!rvc.repo.empty) {
                addThumbnailUrl();
                rvc.repo.children.forEach(function(item){
                    if(item.type == 'document')
                        item.displaySize = fileUtilsService.formatBytes(item.size);
                })
            }
            rvc.breadcrumbs.push({name:rvc.repo.properties.name, objectId:rvc.repo.properties.objectId});
        });
    }

    function _getDocument(objectId){
        var requestObject = {
            profileName: rvc.profileName,
            documentObjectId: objectId
        };
        ermsRepoService.getDocument(requestObject).then(function(response){
            rvc.document = response;
            rvc.document.displaySize = fileUtilsService.formatBytes(response.properties.size);
            debugger;
        });
    }

    function addThumbnailUrl() {
        var mimeTypeProperty = 'contentStreamMimeType';
        rvc.repo.children.forEach(function(item) {
            if(item.type === 'folder'){
                item.thumbNailURL = fileUtilsService.getFolderIcon(24);
            }else{
                item.thumbNailURL = fileUtilsService.getFileIconByMimetype(item[mimeTypeProperty], 24);
            }
        });
    }

    function isFile(item){
        return item.type === "document";
    }

    function getItem(objectId, itemType){
        (itemType === 'folder') ? _getFolderView(objectId) : _getDocument(objectId);
    }
}