angular.module('starter.services', [])
.factory('UserService',[ '$q', '$ionicLoading', '$ionicPopup',
function( $q, $ionicLoading, $ionicPopup){
    var ref = firebase.database().ref('/');

    var self = {
        createUser: createUser,
        login: login,
        logout: logout
    };

    // create User
    function createUser(user) {
        var deferred = $q.defer();
        var self = this;
        $ionicLoading.show({
            template: 'Signing Up...'
        });
        firebase.auth().createUserWithEmailAndPassword(user.email,user.password)
        .then(function (userData) {
            ref.child("/users").child(userData.uid).set({
                uid: userData.uid,
                email: user.email,
                displayName: user.displayName
            });
            //verifyUserMail(userData);

            $ionicLoading.hide();
            login.call(self, user);
            deferred.resolve();
        })
        .catch(function (error) {
            $ionicPopup.alert({
                title: 'Error',
                template: error.message
            });                
            $ionicLoading.hide();
        });
        return deferred.promise;
    }

    function login(user) {
        var deferred = $q.defer();
        var self = this;
        $ionicLoading.show({
            template: 'Signing In...'
        });
        firebase.auth().signInWithEmailAndPassword(user.email,user.password)
        .then(function (authData) {
            $ionicLoading.hide();
            deferred.resolve();
        }).catch(function (error) {
            //alert("Authentication failed:" + error.message);
            $ionicPopup.alert({
                title: 'Authentication failed',
                template: error.message
            });                
            $ionicLoading.hide();
        });
        return deferred.promise;
    }

    function logout() {
        $ionicLoading.show({
            template: 'Logging Out...'
        });
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
            console.log("Sign-out successful");
            $ionicLoading.hide();
        }, function(error) {
            // An error happened.
            console.error("An error happened",error);
            $ionicLoading.hide();
        });                
    };
    return self;
}]);