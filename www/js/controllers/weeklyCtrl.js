
ctrlModule.controller('weeklyCtrl', ['$scope', '$state', '$rootScope','$stateParams', 
    '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion' ,'$ionicModal',
    '$ionicLoading','$ionicPopup','WeeklyService'
,function($scope, $state, $rootScope,$stateParams, 
    $timeout, ionicMaterialInk, ionicMaterialMotion,$ionicModal,
    $ionicLoading, $ionicPopup, WeeklyService) {

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

    function guid() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    var vm = $scope.vm = {
        list_left: WeeklyService.list_left,
        list_right: WeeklyService.list_right,
        form: {
            owner: null,
            writter: null,
            title: '',
            caption: '',
            imageRef: null,
            imgPath: null,
            like2: 0,
            comments: {
                uuid: '123123',
                writter: 'writter name',
                content: 'weefefefefef efefef',
                timestamp: firebase.database.ServerValue.TIMESTAMP
            },
            timestamp: firebase.database.ServerValue.TIMESTAMP
        },
        Submit: function() {
            if(!vm.form.imageRef) {
                $ionicPopup.alert({
                    title: 'Fails',
                    template: 'No Image!'
                });
                return;
            }
            WeeklyService.upload(vm.form)
            .then(function() {
                vm.modal.hide();
            });
        }
    }
    //--------------------------------------------------
    $ionicModal.fromTemplateUrl('templates/photoUploadCaption.html', {
        controller: 'photoUploadCaptionCtrl',
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
        vm.form.imageRef = null;
        vm.form.imgPath = null;
        vm.form.owner = $rootScope.currentUser.uid;
        vm.form.writter = $rootScope.currentUser.email;
        vm.modal.show();
    }
    vm.selectPhoto = function() {
        console.log('select Photo');
        document.getElementById("idFile").click();
    }

    $scope.fileSelect = function (files) {
        var file = files[0];
        console.log('files',files);
        var path = (window.URL || window.webkitURL).createObjectURL(file);
        console.log('path', path,document.getElementById("idFile").value);
        
        $ionicLoading.show('uploading..');
        vm.form.imageRef = '/images/weekly/'+guid()+'.png';
        var uploadTask = storage.ref(vm.form.imageRef).put(file);

        uploadTask.on('state_changed', function(snapshot){
        }, function(error) {
            // Handle unsuccessful uploads
        }, function() {
            vm.form.imgPath = uploadTask.snapshot.downloadURL;
            $ionicLoading.hide();
        });        
    }



}]);