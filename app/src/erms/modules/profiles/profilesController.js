angular
    .module('eArkPlatform.erms.profile')
    .controller('ErmsProfilesController', ErmsProfilesController);

function ErmsProfilesController($mdDialog, $state, ermsProfilesService) {
    var empc = this;
    empc.profiles=[];
    empc.initialise = initialise;
    empc.showProfileDialog = showProfileDialog;
    empc.showConnectDialog1 = showConnectDialog1;
    empc.showConnectDialog2 = showConnectDialog2;
    empc.initialise();
    empc.loadview = loadView;
    empc.currently = '';
    
    if ($state.params.name) {
        empc.currently = decodeURIComponent($state.params.name);
    };
    
    console.log(empc.currently);
    
    function initialise(){
        ermsProfilesService.getProfiles().then(function(response){
            empc.profiles = response.profiles;
            if (!empc.profiles.constructor === Array) {
                empc.profiles = [empc.profiles]
            }
        });
    }

    function showProfileDialog(profile){
        return $mdDialog.show({
            controller: editProfileDialogController,
            controllerAs: 'epd',
            templateUrl: 'app/src/erms/modules/profiles/view/profileDialog.html',
            locals: {
                profile: profile
            },
            parent: angular.element(document.body),
            targetEvent: null,
            clickOutsideToClose: true,
            focusOnOpen: true
        }).then(function() {
            profile = null; //clean on close
            empc.initialise();
        });
    }

    function editProfileDialogController($scope, $mdDialog, profile) {
        var epd = this;
        epd.profile = angular.copy(profile);
        //Set the label for the pop up dialog
        epd.dialogMode = profile ? 'ERMS_PROFILES.PROFILES.DIALOG.LABELS.EDIT_PROFILE' : 'ERMS_PROFILES.PROFILES.DIALOG.LABELS.CREATE_PROFILE';
        //Used to track whether we're editing or creating a new profile
        epd.edit = profile ? true : false;
        if (!epd.profile) {
            epd.profile = {repositories: [] };
        }
        if(epd.profile && !epd.profile.repositories)
            epd.profile.repositories = [];

        epd.profileName = epd.profile.name;

        /**
         * Determines whether we want to add or remove the repository root item from the array
         * @param newValue
         * @param oldValue
         */
        $scope.updateRootList = function(newValue, oldValue){
            if (oldValue)
            var profileName = epd.profile.name;
            var action ;
            if(oldValue.length > newValue.length) action= "delete";
            if(oldValue.length < newValue.length) action= "add";
            if (action =="add") {
                //We only ever add one item at a time
                var newItem = newValue.filter(function (item) { return oldValue.indexOf(item) == -1;})[0];
                ermsProfilesService.addProfileRepo(profileName, newItem).then(function(result){
                    console.log("Profile added: "+ result.success);
                });
            }
            if (action =="delete") {
                //We only ever remove one item at a time
                var removed = oldValue.filter(function (item) { return newValue.indexOf(item) == -1;})[0];
                ermsProfilesService.removeProfileRepo(profileName, removed).then(function(result){
                    console.log("Profile removed: "+ result.success);
                });
            }
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.save = function() {
            $mdDialog.hide();
            if (epd.edit) {
                ermsProfilesService.updateProfile(epd.profile).then(function(response){
                    console.log("==> Profile updated: "+ response);
                })
            } else {
                ermsProfilesService.createProfile(epd.profile).then(function(response){
                    console.log("==> Profile created: "+ response);
                })
            }

        };

        //Set a watcher on the repository root array
        if(epd.profile.repositories && epd.profile.repositories.length >= 0)
            $scope.$watchCollection('epd.profile.repositories', $scope.updateRootList, $scope);
    }

    function loadView(name, selectedRoot, selectedMap){
        console.log('Selected root: ' +selectedRoot + ' & map: ' + selectedMap);
        $state.go('erms.repos.browseRepo', {'name': encodeURIComponent(name)} );
    };
    
    function showConnectDialog1(profile){
        return $mdDialog.show({
            controller: pickRootDialogController,
            controllerAs: 'prdc',
            templateUrl: 'app/src/erms/modules/profiles/view/pickRootDialog.html',
            locals: {
                profile: profile
            },
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            focusOnOpen: true
        }).then(function() {
            empc.showConnectDialog2(profile);
        });
    };
    
    function pickRootDialogController($scope, $mdDialog, profile) {
        var prdc = this;
        prdc.profile = angular.copy(profile);
        prdc.profile.rootNodes = ['root 1', 'root 2', 'root 3', 'root 4'];
        prdc.selectRoot = function(root) {
            profile.selectedRoot = root;
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    };
    
    function showConnectDialog2(profile) {
        return $mdDialog.show({
            controller: pickMapDialogController,
            controllerAs: 'pmdc',
            templateUrl: 'app/src/erms/modules/profiles/view/pickMapDialog.html',
            locals: {
                profile: profile
            },
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            focusOnOpen: true
        }).then(function() {
            empc.currently = profile.name;
            console.log(profile.name + ' & selected root: ' + profile.selectedRoot + ' & map: ' + profile.selectedMap.name);
            $state.go('erms.repos.browseRepo', {'profileName': encodeURIComponent(profile.name)} );
        });
    }
    
    function pickMapDialogController($scope, $mdDialog, profile, ermsMapfilesService) {
        var pmdc = this;
        pmdc.profile = angular.copy(profile);
        pmdc.mapFiles = [];
        ermsMapfilesService.getMapFiles().then(function(response){
            pmdc.mapFiles = response;
        });
        pmdc.selectMap = function(mapfile) {
            profile.selectedMap = mapfile;
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    }

}
