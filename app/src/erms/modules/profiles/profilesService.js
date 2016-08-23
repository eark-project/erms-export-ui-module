angular
    .module('eArkPlatform.erms.profile')
    .factory('ermsProfilesService', ermsProfilesService);

function ermsProfilesService($q, $http){
    return {
        getProfiles     : getProfiles,
        createProfile   : createProfile,
        updateProfile   : updateProfile,
        addProfileRepo  : addProfileRepo,
        removeProfileRepo : removeProfileRepo
    };

    function getProfiles(){
        return $http.get('http://eark.magenta.dk:9090/webapi/database/getProfiles').then(_returnResult);
    }
    function createProfile(profile){
        return $http.post('http://eark.magenta.dk:9090/webapi/database/addProfile', profile).then(_returnResult);
    }
    function updateProfile(profile){
        return $http.put('http://eark.magenta.dk:9090/webapi/database/updateProfile', profile).then(_returnResult);
    }

    function addProfileRepo(profileName, repo){
        return $http.put('http://eark.magenta.dk:9090/webapi/database/profile/'+profileName+'/repository/'+repo).then(_returnResult);
    }

    function removeProfileRepo(profileName, repo){
        return $http.delete('http://eark.magenta.dk:9090/webapi/database/profile/'+profileName+'/repository/'+repo).then(_returnResult);
    }

    /**
     * Generic function for returning the results from the profile as promise
     * @param response
     * @returns {*}
     * @private
     */
    function _returnResult(response){
        var defer = $q.defer();

        try {
        var profileObjects = response.data;
            defer.resolve(profileObjects);
        }
        catch (err) {
            defer.reject('unable to retrieve profiles because: ' + err.message);
        }
        return defer.promise;
    }
}
