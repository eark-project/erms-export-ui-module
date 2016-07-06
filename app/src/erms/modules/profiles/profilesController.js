angular
    .module('eArkPlatform.erms.profile')
    .controller('ErmsProfilesController', ErmsProfilesController);

function ErmsProfilesController($mdDialog, ermsProfilesService) {
    var empc = this;
    empc.profiles=[];
    empc.initialise = initialise;
    empc.showProfileDialog = showProfileDialog;
    empc.initialise();

    function initialise(){
        ermsProfilesService.getProfiles().then(function(response){
            empc.profiles = response.profiles;
            if (!empc.profiles.constructor === Array)
                empc.profiles = [empc.profiles]
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
        epd.dialogMode = profile ? 'ERMS.PROFILES.DIALOG.LABELS.EDIT_PROFILE' : 'ERMS.PROFILES.DIALOG.LABELS.CREATE_PROFILE';
        //Used to track whether we're editing or creating a new profile
        epd.edit = profile ? true : false;

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.save = function() {
            $mdDialog.hide();
            if(epd.edit){
                ermsProfilesService.updateProfile(epd.profile).then(function(response){
                    console.log("==> Profile updated: "+ response);
                })
            }
            else{
                ermsProfilesService.createProfile(epd.profile).then(function(response){
                    console.log("==> Profile created: "+ response);
                })
            }


        };
    }

}