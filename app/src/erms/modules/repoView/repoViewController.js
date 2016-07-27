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

    rvc.loadRepoView();

    /**
     *  This function will either load the root folder view or the contents of the folder requested.
     *
     * @param profileName Misleadingly, can be either the profile name or the object Id of the folder
     */
    function loadRepoView(){
        rvc.profileName ? _getRootView(rvc.profileName) : _getFolderView(rvc.profileName);
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
        return item.type == "folder";
    }

    function getItem(objectId){
            _getFolderView(objectId);
    }
}