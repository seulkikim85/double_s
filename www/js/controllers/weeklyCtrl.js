
ctrlModule.controller('weeklyCtrl', ['$scope', '$state', '$rootScope','$stateParams', 
    '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion' ,'$ionicModal',
    '$ionicLoading','$ionicPopup','WeeklyService','PhotoService','Tools','EventTrigger'
,function($scope, $state, $rootScope,$stateParams, 
    $timeout, ionicMaterialInk, ionicMaterialMotion,$ionicModal,
    $ionicLoading, $ionicPopup, WeeklyService, PhotoService, Tools,EventTrigger) {

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    // ionicMaterialMotion.pushDown({
    //     selector: '.push-down'
    // });
    // ionicMaterialMotion.fadeSlideInRight({
    //     selector: '.animate-fade-slide-in .item'
    // });
    var storage = firebase.storage();

    var vm = $scope.vm = {
        list_left: WeeklyService.list_left,
        list_right: WeeklyService.list_right,
        previewer: null,
        form: {
            avatar: null,
            owner: null,
            writter: null,
            title: '',
            caption: '',
            imageRef: null,
            imgPath: null,
            like2: 0,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        },
        base64img: null,
        Submit: function() {
            if(!vm.base64img) {
                $ionicPopup.alert({
                    title: 'Fails',
                    template: 'No Image!'
                });
                return;
            }
            WeeklyService.upload(vm.base64img, vm.form)
            .then(function() {
                vm.modal.hide();
            });
        }
    }
      EventTrigger.add('loaded-url-weekly',function(){
          if(!EventTrigger.isRefreshing())
              $scope.$apply();
      });      
    //--------------------------------------------------
    $ionicModal.fromTemplateUrl('templates/weeklyPhotoUpload.html', {
        controller: 'weeklyPhotoUploadCtrl',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        vm.modal = modal;
    });
    
    $scope.closeModal = function() {
        vm.modal.hide();
    }
    $scope.UploadContent = function() {
        console.log('UploadContent');
        if(!$rootScope.currentUser) {
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
    vm.selectPhoto = function() {
        console.log('select Photo');
        document.getElementById("idFile").click();
    }

    $scope.fileSelect = function (files) {
        vm.file = files[0];
        // console.log('files',files);
        // var path = (window.URL || window.webkitURL).createObjectURL(vm.file);
        // console.log('path', path,document.getElementById("idFile").value);
     
        $ionicLoading.show('image processing..')
        PhotoService.LoadOrientationImage(vm.file, function (base64img, value) {
            if(value == 1) {
                vm.previewer.src = base64img;
                vm.base64img = base64img;
                $ionicLoading.hide();
            }
            else {
                Tools.resetOrientation(base64img,value,function(resetBase64Img){
                    vm.previewer.src = resetBase64Img;
                    vm.base64img = resetBase64Img;
                    $ionicLoading.hide();
                });
            }
        });     

    }


}]);