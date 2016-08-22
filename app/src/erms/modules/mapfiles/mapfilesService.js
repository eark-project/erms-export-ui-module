angular
    .module('eArkPlatform.erms.mapfiles')
    .factory('ermsMapfilesService', ermsMapfilesService);

function ermsMapfilesService(){
    
    var mapFiles = [];
    
    return {
        addMapFile: addMapFile,
        getMapFiles: getMapFiles,
        delMapFile: delMapFile
    };
    
    function addMapFile(file){
        mapFiles.push(file);
    };
    
    function getMapFiles() {
        return(mapFiles);
    }
    
    function delMapFile(file) {
        mapFiles.splice(mapFiles.indexOf(file), 1);
    }

}
