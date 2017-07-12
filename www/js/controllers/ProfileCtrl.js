
ctrlModule.controller('ProfileCtrl', function($scope, $rootScope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk
,$ionicPopup ,$ionicLoading, PhotoService, UserService  ) {
    // Set Ink
    ionicMaterialInk.displayEffect();
    var vm = $scope.vm = {
        user: {
            displayName: ''
        },
        myAvatarImg: null

    };
    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    vm.isLogined = function() {
        return $rootScope.currentUser != undefined;
    }    
    vm.user = $rootScope.currentUser;

    $scope.$on('$ionicView.enter', function(e) {
        vm.myAvatarImg = UserService.loadMyAvatar();
    });
    console.log('user',$rootScope.currentUser);

    vm.UploadContent = function() {
        console.log('select Photo');
        if(!vm.isLogined()) {
            $ionicPopup.alert({
                title: 'Fails',
                template: 'Not Login User'
            });
            return;
        }
        document.getElementById("idFile").click();
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
            PhotoService.Avatars.put($rootScope.currentUser.uuid,base64img);
        });     

    }
});