angular
    .module('eArkPlatform.erms.mapfiles')
    .factory('ermsMapfilesService', ermsMapfilesService);

function ermsMapfilesService($http){
    
    var mapFiles = [];
    
    return {
        addMapFile: addMapFile,
        getMapFiles: getMapFiles,
        delMapFile: delMapFile
    };
    
    function addMapFile(mapping){
        var formData = new FormData();
        var url = 'http://localhost:9090/webapi/mapping/upload';
        formData.append('file', mapping.file);
        formData.append('mappingName', mapping.mappingName);
        return $http.post(url, formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(function (response) {
            return response.data;
        });
        //mapFiles.push(file);
    }
    
    function getMapFiles() {
        return(mapFiles);
    };
    
    function delMapFile(file) {
        mapFiles.splice(mapFiles.indexOf(file), 1);
    };

}
