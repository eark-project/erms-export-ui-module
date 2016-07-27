angular
    .module('eArkPlatform.erms.repoView')
    .factory('ermsRepoService', ermsRepoService);

function ermsRepoService($q, $http){
    return {
        connect             : connect,
        getFolderChildren   : getFolderChildren
    };

    /**
     * Returns the properties of the root folder of a profile repository along with its children.
     * This should only really be called when clicking on the profile name in the view or the root in the breadcrumb
     * trail.
     * @param profileName
     * @returns {*}
     */
    function connect(profileName){
        return $http.post('http://localhost:9090/webapi/repository/connect', {profileName:profileName} ).then(
            function(response){
                return response.data.rootFolder
            }
        );
    }

    /**
     * Will return the properties of a folder and its children pretty much in the same format as the connect function
     * @param requestObject
     * @returns {*}
     */
    function getFolderChildren(requestObject){
        return $http.post('http://localhost:9090/webapi/repository/getFolder', requestObject).then(function(response){
            return response.data.folder;
        });
    }

}
