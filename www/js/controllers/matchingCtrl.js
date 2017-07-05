ctrlModule.controller('matchingCtrl', ['$scope','MatchService','EventTrigger','$ionicModal'
,'$rootScope','PhotoService','$ionicLoading','$ionicPopup'
, function($scope,MatchService,EventTrigger,$ionicModal,$rootScope
, PhotoService,$ionicLoading,$ionicPopup ) {

    // $scope.$parent.showHeader();
    // $scope.$parent.clearFabs();
    // $scope.isExpanded = true;
    // $scope.$parent.setExpanded(true);
    // $scope.$parent.setHeaderFab(false);

    // ionicMaterialInk.displayEffect();

    var storage = firebase.storage();

    var vm = $scope.vm = {
        list_left: MatchService.list_left,
        list_right: MatchService.list_right,
        previewer: null,
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
            like2: 0,
            comments: {
                uuid: '123123',
                writter: 'writter name',
                content: 'weefefefefef efefef',
                timestamp: firebase.database.ServerValue.TIMESTAMP
            },
            timestamp: firebase.database.ServerValue.TIMESTAMP
        },
        base64img: null,
        Submit: function () {
            if (!vm.base64img) {
                $ionicPopup.alert({
                    title: 'Fails',
                    template: 'No Image!'
                });
                return;
            }
            MatchService.upload(vm.base64img, vm.form)
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

    $ionicModal.fromTemplateUrl('templates/photoUpload.html', {
        controller: 'photoUploadCtrl',
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

        vm.base64img = null;
        vm.form.title = "";
        vm.form.caption = "";
        vm.form.imageRef = null;
        vm.form.imgPath = null;
        vm.form.avatar = null;
        vm.form.owner = $rootScope.currentUser.uid;
        vm.form.writter = $rootScope.currentUser.email;
        vm.modal.show();
        vm.previewer = document.getElementById('previewer');
        vm.previewer.src = "img/upload_bg.jpg";
    }
    vm.selectPhoto = function () {
        console.log('select Photo');
        document.getElementById("idFile").click();
    }

    $scope.fileSelect = function (files) {
        vm.file = files[0];

        $ionicLoading.show('image processing..')
        PhotoService.LoadOrientationImage(vm.file, function (base64img, value) {
            if (value == 1) {
                vm.previewer.src = base64img;
                vm.base64img = base64img;
                $ionicLoading.hide();
            }
            else {
                Tools.resetOrientation(base64img, value, function (resetBase64Img) {
                    vm.previewer.src = resetBase64Img;
                    vm.base64img = resetBase64Img;
                    $ionicLoading.hide();
                });
            }
        });

    }

}]);