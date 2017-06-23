/* global angular, document, window */
'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

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
})

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

.controller('weeklyCtrl', function($scope, $state, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion   ) {

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });

})

.controller('matchingCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk) {

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

})
.controller('joinCtrl', function() {
    
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
.controller('LoginCtrl', function($scope, $timeout, $stateParams, ionicMaterialInk) {
    $scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    ionicMaterialInk.displayEffect();
})

.controller('FriendsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
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

.controller('ActivityCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    // $scope.$parent.showHeader();
    // $scope.$parent.clearFabs();
    // $scope.isExpanded = true;
    // $scope.$parent.setExpanded(true);
    // $scope.$parent.setHeaderFab('right');

    $scope.test_say = 'says "Perhaps that is the secret. It is not what we do, so much as why we do it."';

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
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
