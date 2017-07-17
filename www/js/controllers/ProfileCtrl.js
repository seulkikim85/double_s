
ctrlModule.controller('ProfileCtrl', function($scope, $rootScope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk
,$ionicPopup ,$ionicLoading, PhotoService, UserService, $ionicHistory  ) {
    
    // Set Ink
    ionicMaterialInk.displayEffect();
    var vm = $scope.vm = {
        user: {
            displayName: '',
            email: ''
        },
        newPassword: '',
        myAvatarImg: null
    };
    vm.user = $rootScope.currentUser;
    
    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    vm.isLogined = function() {
        return $rootScope.currentUser != undefined;
    }    

    $scope.$on('$ionicView.enter', function(e,v,a) {
        vm.myAvatarImg = UserService.loadMyAvatar();
        vm.user = $rootScope.currentUser;
        if(!$rootScope.$root.$$phase)
            $scope.$apply();
    });
    // Change menu button to back button for going back
    // $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    //     if($rootScope.previousState)
    //         viewData.enableBack = true;        
    // });
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        var histroyBack = $ionicHistory.backView();
        if(histroyBack)
            viewData.enableBack = true;        
    });
    
    console.log('user',$rootScope.currentUser);

    vm.UploadContent = function() {
        console.log('select Photo');
        if(!vm.isLogined()) {
            $ionicPopup.alert({
                title: 'Fails',
                template: 'Not Login User'
            });
        }
    }
    vm.fileSelect = function (files) {
        vm.file = files[0];
        // console.log('files',files);
        // var path = (window.URL || window.webkitURL).createObjectURL(vm.file);
        // console.log('path', path,document.getElementById("idFile").value);
     
        $ionicLoading.show('image processing..')
        PhotoService.LoadOrientationImage(vm.file, function (base64img, value) {
            UserService.saveMyAvatar(base64img);
            vm.myAvatarImg = base64img;
            PhotoService.Avatars.put($rootScope.currentUser.uid,base64img);
        });     
    }

    vm.SavePassword = function() {
        var auth = firebase.auth();

        auth.currentUser.updatePassword(vm.newPassword).then(function () {
            vm.newPassword = '';
            $ionicPopup.alert({
                title: 'Change Paasword',
                template: 'complete'
            });
        }, function (error) {
            $ionicPopup.alert({
                title: 'Change Error',
                template: error
            });
        });
        var isWantToUseEmail = false;
        if(isWantToUseEmail) {
            auth.sendPasswordResetEmail($rootScope.currentUser.email).then(function () {
                $ionicPopup.alert({
                    title: 'Reset Email Password',
                    template: 'Send complete'
                });
            }, function (error) {
                $ionicPopup.alert({
                    title: 'Fail Send Email',
                    template: error
                });
            });        
        }
    }
});
