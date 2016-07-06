angular
    .module('eArkPlatform.erms.profile')
    .factory('ermsProfilesService', ermsProfilesService);

function ermsProfilesService($q, $http){
    return {
        getProfiles     : getProfiles,
        createProfile   : createProfile,
        updateProfile   : updateProfile
    };

    function getProfiles(){
        return $http.get('http://localhost:8080/webapi/database/getProfiles').then(_returnResult);
    }
    function createProfile(profile){
        return $http.post('http://localhost:8080/webapi/database/addProfile', profile).then(_returnResult);
    }
    function updateProfile(profile){
        return $http.put('http://localhost:8080/webapi/database/updateProfile', profile).then(_returnResult);
    }

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