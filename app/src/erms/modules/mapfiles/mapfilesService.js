angular
    .module('eArkPlatform.erms.mapfiles')
    .factory('ermsMapfilesService', ermsMapfilesService);

function ermsMapfilesService($http){
    
    var mapFiles;
    
    return {
        addMapFile: addMapFile,
        getMapFiles: getMapFiles,
        delMapFile: delMapFile
    };
    
    function addMapFile(mapping){
        var formData = new FormData();
        formData.append('file', mapping.file);
        formData.append('mappingName', mapping.mappingName);
        return $http.post('/webapi/mapping/upload', formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(function (response) {
            console.log(response.data);
            return response.data;
        });
    }
    
    function getMapFiles() {
        mapFiles = $http.get('/webapi/mapping/get/mappings').then(function(response){
            return response.data.mappings;
        });
        return mapFiles;
    }
    
    function delMapFile(file) {
        return $http.delete('/webapi/mapping/remove/'+file.name).then(function(response){
            return response.data;
        });
    }

}
