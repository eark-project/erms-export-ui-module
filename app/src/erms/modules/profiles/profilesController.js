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
            };
        });
    };

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
    };

    function editProfileDialogController($scope, $mdDialog, profile) {
        var epd = this;
        epd.profile = angular.copy(profile);
        //Set the label for the pop up dialog
        epd.dialogMode = profile ? 'ERMS.PROFILES.DIALOG.LABELS.EDIT_PROFILE' : 'ERMS.PROFILES.DIALOG.LABELS.CREATE_PROFILE';
        //Used to track whether we're editing or creating a new profile
        epd.edit = profile ? true : false;
        if (!epd.profile) {
            epd.profile = { rootNodes: [] };
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
            };

        };
    };

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
            $state.go('erms.repos.browseRepo', {'name': encodeURIComponent(profile.name)} );
        });
    };
    
    function pickMapDialogController($scope, $mdDialog, profile, ermsMapfilesService) {
        var pmdc = this;
        pmdc.profile = angular.copy(profile);
        pmdc.mapFiles = ermsMapfilesService.getMapFiles();
        pmdc.selectMap = function(mapfile) {
            profile.selectedMap = mapfile;
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    };

};