ctrlModule.controller('matchingCtrl', ['$scope','MatchService','EventTrigger','$ionicModal'
,'$rootScope','PhotoService','$ionicLoading','$ionicPopup', 'Tools'
, function($scope,MatchService,EventTrigger,$ionicModal,$rootScope
, PhotoService,$ionicLoading,$ionicPopup,Tools ) {

    // $scope.$parent.showHeader();
    // $scope.$parent.clearFabs();
    // $scope.isExpanded = true;
    // $scope.$parent.setExpanded(true);
    // $scope.$parent.setHeaderFab(false);

    // ionicMaterialInk.displayEffect();

    var storage = firebase.storage();

    var vm = $scope.vm = {
        list: MatchService.list,
        previewer1: null,
        previewer2: null,
        form: {
            avatar: null,
            owner: null,
            writter: null,
            title: '',
            caption: '',
            image1Ref: null,
            img1Path: null,
            image2Ref: null,
            img2Path: null,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        },
        base64img1: null,
        base64img2: null,
        Submit: function () {
            if (!vm.base64img1 || !vm.base64img2) {
                $ionicPopup.alert({
                    title: 'Fails',
                    template: 'No Image!'
                });
                return;
            }
            MatchService.upload(vm.base64img1,vm.base64img2, vm.form)
                .then(function () {
                    vm.modal.hide();
                });
        }
    }
    EventTrigger.add('loaded-url-matching', function () {
        if (!EventTrigger.isRefreshing())
            $scope.$apply();
    });

    // //-----------------------------------------------------

    $ionicModal.fromTemplateUrl('templates/matchPhotoUpload.html', {
        controller: 'matchPhotoUploadCtrl',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        vm.modal = modal;
    });

    $scope.closeModal = function () {
        vm.modal.hide();
    }
    $scope.UploadContent = function () {
        console.log('UploadContent');
        if (!$rootScope.currentUser) {
            $ionicPopup.alert({
                title: 'Required Authentication!!',
                template: 'Log in Please!!'
            });
            return;
        }

        vm.base64img1 = null;
        vm.base64img2 = null;

        vm.form.title = "";
        vm.form.caption = "";
        vm.form.imageRef1 = null;
        vm.form.imgPath1 = null;
        vm.form.imageRef2 = null;
        vm.form.imgPath2 = null;
        vm.form.avatar = PhotoService.Avatars.get($rootScope.currentUser.uid);
        vm.form.owner = $rootScope.currentUser.uid;
        vm.form.writter = $rootScope.currentUser.email;
        vm.modal.show();

        vm.previewer1 = document.getElementById('previewer1');
        vm.previewer1.src = "img/upload_bg.jpg";
        vm.previewer2 = document.getElementById('previewer2');
        vm.previewer2.src = "img/upload_bg.jpg";
    }
    vm.selectPhoto = function (id) {
        console.log('select Photo');
        document.getElementById(id).click();
    }

    $scope.fileSelect1 = function (files) {
        vm.file1 = files[0];

        $ionicLoading.show('image processing..')
        PhotoService.LoadOrientationImage(vm.file1, function (base64img, value) {
            if (value == 1 || true) {
                vm.previewer1.src = base64img;
                vm.base64img1 = base64img;
                $ionicLoading.hide();
            }
            else {
                Tools.resetOrientation(base64img, value, function (resetBase64Img) {
                    vm.previewer1.src = resetBase64Img;
                    vm.base64img1 = resetBase64Img;
                    $ionicLoading.hide();
                });
            }
        });

    }

    $scope.fileSelect2 = function (files) {
        vm.file2 = files[0];

        $ionicLoading.show('image processing..')
        PhotoService.LoadOrientationImage(vm.file2, function (base64img, value) {
            if (value == 1 || true) {
                vm.previewer2.src = base64img;
                vm.base64img2 = base64img;
                $ionicLoading.hide();
            }
            else {
                Tools.resetOrientation(base64img, value, function (resetBase64Img) {
                    vm.previewer2.src = resetBase64Img;
                    vm.base64img2 = resetBase64Img;
                    $ionicLoading.hide();
                });
            }
        });

    }

}]);