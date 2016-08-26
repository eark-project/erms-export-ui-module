angular
    .module('eArkPlatform.erms.mapfiles')
    .factory('ermsMapfilesService', ermsMapfilesService);

function ermsMapfilesService($http){
    
    var baseUrl = 'http://eark.magenta.dk:9090/webapi/mapping/';
    
    return {
        addMapFile: addMapFile,
        getMapFiles: getMapFiles,
        delMapFile: delMapFile
    };
    
    function addMapFile(mapping){
        var formData = new FormData();
        var url = baseUrl+'upload';
        formData.append('file', mapping.file);
        formData.append('mappingName', mapping.mappingName);
        return $http.post(url, formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(function (response) {
            console.log(response.data);
            return response.data;
        });
    }
    
    function getMapFiles() {
        var mapFiles = $http.get(baseUrl+'mappings').then(function(response){
            return response.data.mappings;
        });
        return mapFiles;
    }
    
    function delMapFile(file) {
        mapFiles.splice(mapFiles.indexOf(file), 1);
    };

}
