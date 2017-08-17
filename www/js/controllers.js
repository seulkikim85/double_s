/* global angular, document, window */
'use strict';

var ctrlModule = angular.module('starter.controllers', []);
    
ctrlModule.controller('weeklyPhotoUploadCtrl', function($scope,$ionicHistory) {
      $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        var histroyBack = $ionicHistory.backView();
        if(histroyBack && histroyBack.stateName == 'app.photoUpload' )
            viewData.enableBack = true;        
    });

    var vm = $scope.vm;
})

.controller('introCtrl', function() {
    
})

.controller('matchPhotoUploadCtrl', function() {

})

.controller('adminCtrl', function() {
    
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

/*

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
        //
        // if given group is the selected group, deselect it
        // else, select the given group
        //

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
*/
;
