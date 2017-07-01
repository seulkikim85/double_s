/* global angular, document, window */
'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', ['$scope','$ionicModal','$ionicPopup', '$rootScope', '$ionicLoading', 'UserService',
 function($scope, $ionicModal, $ionicPopup, $rootScope, $ionicLoading, UserService) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.joinData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;
    //seulki
    $scope.weeklyData = {};

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };

    ////////////////////////////////////////
    // Login/Join Methods
    ////////////////////////////////////////

    $scope.isLogined = function() {
        return $rootScope.currentUser != undefined;
    }

    $scope.showJoin = function() {
        console.log('show Join');
        if($scope.modalLogin)
            $scope.modalLogin.hide();
        $scope.joinData = {};
        //--------------------------------------------------
        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/join.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modalJoin = modal;
            modal.show();
        });
    }    
    $scope.clickJoin = function(user) {
        console.log('click Join',user);
        UserService.createUser(user).then(function(){
            $scope.modalJoin.hide();
        });
    }
    /////////////////////////show lost password//
     $scope.showLostPassword = function() {
        console.log('show LostPassword');
        if($scope.modalLogin)
            $scope.modalLogin.hide();
        $scope.lostPasswordData = {};
        //--------------------------------------------------
        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/lostPassword.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modalLostPassword = modal;
            modal.show();
        });
    }    
    $scope.clickJoin = function(user) {
        console.log('click LostPassword',user);
        UserService.createUser(user).then(function(){
            $scope.modalLostPassword.hide();
        });
    }
    ///////////////////

    $scope.showLogin = function() {
        console.log('show login');
        //--------------------------------------------------
        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modalLogin = modal;
            modal.show();
        });
    }
    $scope.clickLogin = function(user) {
        console.log('click Login',user);
        UserService.login(user).then(function(){
            $scope.modalLogin.hide();
        });
    }

    firebase.auth().onAuthStateChanged(function (authData) {
        if (authData) {
            console.log("Logged in as:", authData.uid, authData);

            var ref = firebase.database().ref('/');
            ref.child("users").child(authData.uid).once('value', function (snapshot) {
                var user = snapshot.val();
                console.log("User in :", user);
                $rootScope.currentUser = user;
                $scope.loginData = user;
            });

        } else {
            console.log("authData is cleared");
            $rootScope.currentUser = undefined;
        }
    });    

    // A confirm dialog - Logout
    $scope.showLogout = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Logout',
            template: 'Are you sure you want to logout?'
        });

        confirmPopup.then(function (res) {
            if (res) {
                UserService.logout();
            }
        });
    }

}])

.controller('mainCtrl',function($scope,$state) {
    $scope.clickLink = function(next) {
        console.log('Click',next);
        $state.go(next);
    }

    $scope.isMain = function() {
        if($state.current.name == 'app.main.weekly' ||
            $state.current.name == 'app.main.matching' )
            return true;

        return false;
    }
})

.directive('fileChange', function() {
    return {
     restrict: 'A',
     scope: {
       handler: '&'
     },
     link: function (scope, element) {
      element.on('change', function (event) {
        scope.$apply(function(){
          scope.handler({files: event.target.files});
        });
      });
     }
    };
})

.controller('weeklyCtrl', ['$scope', '$state', '$rootScope','$stateParams', 
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
                timestamp: Date.now() 
            },
            timestamp: Date.now() 
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



}])
.controller('matchingCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, $ionicLoading, $rootScope) {
    var storage = firebase.storage();

    
    storage.ref("/images/test.jpg").getDownloadURL()
    .then(function(url) {
        $scope.bgImg = url;
        console.log(url);
    });

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    var vm = $scope.vm = {
        list: []
    };

    // sync list
    var ref = firebase.database().ref('/');
    ref.child("matching").on('child_added', function (snapshot) {
        var info = snapshot.val();
        vm.list.push(info);
    });

    $scope.UploadContent = function() {
        console.log('UploadContent');
        //document.getElementById("idFile").click();

        if(!$rootScope.currentUser) {
            alert('Need Login');
            return;
        }

        var newContent ={
                owner: $rootScope.currentUser.uid,
                writter: $rootScope.currentUser.email,
                title: 'new title',
                caption: 'new Caption',
                img1: 'https://firebasestorage.googleapis.com/v0/b/capstone-project-a56d3.appspot.com/o/style-dress%2Fhat.jpg?alt=media&token=5814b47a-8b97-4728-9ccf-7b47b51a0e2d',
                img2: 'https://firebasestorage.googleapis.com/v0/b/capstone-project-a56d3.appspot.com/o/style-dress%2Fbag.jpg?alt=media&token=d917fa38-6ffe-46d3-a5e5-bc94bbb16c73',
                like2: 0,
                comments: {
                    uuid: '123123',
                    writter: 'writter name',
                    content: 'weefefefefef efefef',
                    timestamp: Date.now() 
                },
                timestamp: Date.now() 
            };

        var ref = firebase.database().ref('/');
        ref.child("matching").push().set(newContent);
        
    }

    $scope.fileSelect = function (files) {
        var file = files[0];
        console.log('files',files);
        var path = (window.URL || window.webkitURL).createObjectURL(file);
        console.log('path', path,document.getElementById("idFile").value);
        
        
        $ionicLoading.show('uploading..');
        var uploadTask = storage.ref('/images/test.jpg').put(file);

        uploadTask.on('state_changed', function(snapshot){
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
            break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
            break;
        }
        }, function(error) {
            // Handle unsuccessful uploads
        }, function() {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            $scope.bgImg = uploadTask.snapshot.downloadURL;
            $ionicLoading.hide();
        });        
    }
    

})

.controller('weeklyDetailCtrl', function($scope,$ionicHistory) {
    // force back button
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        var histroyBack = $ionicHistory.backView();
        if(histroyBack && histroyBack.stateName == 'app.main.weekly' )
            viewData.enableBack = true;        
    });

    var vm = $scope.vm = {};

    vm.avatar =  'https://firebasestorage.googleapis.com/v0/b/capstone-project-a56d3.appspot.com/o/face.jpg?alt=media&token=260d326c-0b63-4eaf-9a31-897ab5747f39';
    vm.photo = 'https://firebasestorage.googleapis.com/v0/b/capstone-project-a56d3.appspot.com/o/bag.jpg?alt=media&token=ab5039c3-3aeb-451a-9d3d-b12d379f99fa';
    vm.description = 'She look so nice style and also ...';
    vm.writter = 'Sansa Stark';
    vm.likes = 6;
    vm.comments = 5;
    vm.timestamp =  Date.now();
    vm.p = "https://firebasestorage.googleapis.com/v0/b/capstone-project-a56d3.appspot.com/o/bag.jpg?alt=media&token=ab5039c3-3aeb-451a-9d3d-b12d379f99fa";
    

})

.controller('photoUploadCaptionCtrl', function($scope,$ionicHistory) {
      $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        var histroyBack = $ionicHistory.backView();
        if(histroyBack && histroyBack.stateName == 'app.photoUpload' )
            viewData.enableBack = true;        
    });

    var vm = $scope.vm;
})


.controller('matchDetailCtrl', function($scope,$ionicHistory) {
    // force back button
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        var histroyBack = $ionicHistory.backView();
        if(histroyBack && histroyBack.stateName == 'app.main.matching' )
            viewData.enableBack = true;        
    });



    var vm = $scope.vm = {};

    vm.avatar =  'https://firebasestorage.googleapis.com/v0/b/capstone-project-a56d3.appspot.com/o/face.jpg?alt=media&token=260d326c-0b63-4eaf-9a31-897ab5747f39';
    vm.photo = 'https://firebasestorage.googleapis.com/v0/b/capstone-project-a56d3.appspot.com/o/bag.jpg?alt=media&token=ab5039c3-3aeb-451a-9d3d-b12d379f99fa';
    vm.description = 'She look so nice style and also ...';
    vm.writter = 'Sansa Stark';
    vm.likes = 6;
    vm.comments = 5;
    vm.timestamp =  Date.now();
    vm.p = "https://firebasestorage.googleapis.com/v0/b/capstone-project-a56d3.appspot.com/o/bag.jpg?alt=media&token=ab5039c3-3aeb-451a-9d3d-b12d379f99fa";
    
})

.controller('introCtrl', function() {
    
})

.controller('photoUploadCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, $ionicLoading, $rootScope) {



        var storage = firebase.storage();


    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    var vm = $scope.vm = {
        list: []
    };

    
    $scope.clickWeeklyUpload = function(user) {
        console.log('click WeeklyUpload',user);
        
    }

    // sync list
    var ref = firebase.database().ref('/');
    ref.child("weekly").on('child_added', function (snapshot) {
        var info = snapshot.val();
        vm.list.push(info);
    });

    $scope.UploadContent = function() {
        console.log('UploadContent');
        //document.getElementById("idFile").click();


        var newContent ={
                owner: $rootScope.currentUser.uid,
                writter: $rootScope.currentUser.email,
                title: 'new title',
                caption: 'new Caption',
                img1: 'https://firebasestorage.googleapis.com/v0/b/capstone-project-a56d3.appspot.com/o/style-dress%2Fhat.jpg?alt=media&token=5814b47a-8b97-4728-9ccf-7b47b51a0e2d',
        
                
                timestamp: Date.now() 
            };

        var ref = firebase.database().ref('/');
        ref.child("weekly").push().set(newContent);
        
    }


        uploadTask.on('state_changed', function(snapshot){
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
            break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
            break;
        }
        }, function(error) {
            // Handle unsuccessful uploads
        }, function() {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            $scope.bgImg = uploadTask.snapshot.downloadURL;
            $ionicLoading.hide();
        });        
    
 
})

.controller('ProfileCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('GalleryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);

    // force back button
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        var histroyBack = $ionicHistory.backView();
        if(histroyBack && histroyBack.stateName == 'app.main.weekly' )
            viewData.enableBack = true;        
    });

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });

})
.controller('paletteCtrl', function ($scope,
    $stateParams, $ionicActionSheet, $timeout, $ionicLoading, $ionicModal, $ionicPopup, ionicMaterialInk) {
    ionicMaterialInk.displayEffect();

    // Expandable list
    $scope.groups = [];
    for (var i = 0; i < 5; i++) {
        $scope.groups[i] = {
            name: i,
            items: [],
            show: false
        };
        for (var j = 0; j < 3; j++) {
            $scope.groups[i].items.push(i + '-' + j);
        }
    }
    /*
        * if given group is the selected group, deselect it
        * else, select the given group
        */
    $scope.toggleGroup = function (group) {
        group.show = !group.show;
    };
    $scope.isGroupShown = function (group) {
        return group.show;
    };
    // end of expandable list

    // Triggered on a button click, or some other target
    $scope.actionSheet = function () {

        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            buttons: [{
                text: '<b>Share</b> This'
            }, {
                text: 'Move'
            }],
            destructiveText: 'Delete',
            titleText: 'Modify your album',
            cancelText: 'Cancel',
            cancel: function () {
                // add cancel code..
            },
            buttonClicked: function (index) {
                return true;
            }
        });

        // For example's sake, hide the sheet after two seconds
        $timeout(function () {
            hideSheet();
        }, 2000);

    };
})
;