ctrlModule.controller('AppCtrl', ['$scope','$ionicModal','$ionicPopup', '$rootScope', '$ionicLoading', 'UserService',
 function($scope, $ionicModal, $ionicPopup, $rootScope, $ionicLoading, UserService) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.joinData = {};
    $scope.myAvatarImg = UserService.loadMyAvatar();
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
    $scope.clickLostPassword = function(user) {
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
            $scope.myAvatarImg = UserService.loadMyAvatar();

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

}]);
