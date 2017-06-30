angular.module('starter.services', [])

//////////////////////////////////////////////////////////////////////////////////
.filter('orderObjectBy', function () {
    return function (items, field, ascending) {
        var filtered = [];
        angular.forEach(items, function (item) {
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            return (a[field] > b[field] ? 1 : -1);
        });
        if (!ascending) 
            filtered.reverse();
        return filtered;
    };
})
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
.factory('UserService',[ '$q', '$ionicLoading', '$ionicPopup'
,function( $q, $ionicLoading, $ionicPopup) {
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
}])

//////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////
.factory('MatchService',[ '$q', '$ionicLoading', '$ionicPopup'
,function( $q, $ionicLoading, $ionicPopup) {
    var ref = firebase.database().ref('/');

    var self = {
        all: {},
        upload: upload
    }

    getAll();


    function getAll() {
        ref.child('matching')
        .on('child_added',function(snap){
            self.all[snap.key] = snap.val();
        });
    }

    function upload() {

    }
}])
//////////////////////////////////////////////////////////////////////////////////////////////////////
.factory('WeeklyService',[ '$q', '$ionicLoading', '$ionicPopup'
,function( $q, $ionicLoading, $ionicPopup) {
    var ref = firebase.database().ref('/');

    var self = {
        list_left: [],
        list_right: [],
        upload: upload
    }

    getAll();


    function getAll() {
        ref.child('weekly')
        .on('child_added',function(snap){
            var info = snap.val();
            info.sort = info.key;
            console.log('weekly item',info);
            if(self.list_left.length > self.list_right.length)
                self.list_right.push(info);
            else
                self.list_left.push(info);
        });
    }

    function upload(form) {
        var deferred = $q.defer();
        $ionicLoading.show('Saving...');
        var ref = firebase.database().ref('/');
        ref.child("weekly").push().set(form)
        .then(function(){
            console.log('save complete');
            $ionicLoading.hide();
            deferred.resolve();
        });
        return deferred.promise;
    }

    return self;
}])

//////////////////////////////////////////////////////////////////////////////////////////////////////
.factory('PhotoService',[ '$log','$q','Firebase', '$cordovaCamera','$ionicLoading'

//////////////////////////////////////////////////////////////////////////////////////////////////////
,function PhotoService ($log, $q, Firebase, $cordovaCamera, $ionicLoading) {
        var self = {};

        angular.extend(self,{
            images: {
                data: {},
                get: getImage,
            },
            takeImage: takeImage,
            UpdateImageFromBase64: UpdateImageFromBase64,
        });

        // load profile image from server
        var ref = Firebase.storage().ref('/');

        function UpdateImageFromBase64(imageBase64) {
            var deferred = $q.defer();
            self.savePhoto('data:image/png;base64,'+imageBase64);
            UploadImageBase64(imageBase64)
                .then(function (downloadURL) {
                    deferred.resolve(downloadURL);
                });
            return deferred.promise;
        }
        
        function UploadImage(refPath,file) {
            var deferred = $q.defer();
            if(UserService.getProfile()) {
                var task = ref.child('images/'+refPath)
                .put(file);

                UploadTaskProgress(task).then(function(downloadURL){
                    deferred.resolve(downloadURL);
                });
            }
            return deferred.promise;
        }

        function UploadImageBase64(refPath,imageBase64) {
            var deferred = $q.defer();
            if(UserService.getProfile()) {
                var task = ref.child('images/'+refPath)
                .putString(imageBase64,'base64', {contentType:'image/jpg'});

                UploadTaskProgress(task).then(function(downloadURL){
                    deferred.resolve(downloadURL);
                });
            }
            return deferred.promise;
        }

        // Upload file
        function UploadTaskProgress(uploadTask) {
            var deferred = $q.defer();
            $ionicLoading.show('uploading..');

            uploadTask.on('state_changed', function(snapshot){
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            $log.debug('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    $log.debug('Upload is paused');
                break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    $log.debug('Upload is running');
                break;
            }
            }, function(error) {
                // Handle unsuccessful uploads
            }, function() {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                deferred.resolve(uploadTask.snapshot.downloadURL);
                $ionicLoading.hide();
            });             
          
            return deferred.promise;
        }

        function takeImage() {
            var deferred = $q.defer();
            var options = {
                quality: 80,
                destinationType: Camera.DestinationType.DATA_URL,
                // sourceType: Camera.PictureSourceType.CAMERA,
                sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 250,
                targetHeight: 250,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };
            
            $cordovaCamera.getPicture(options).then(function(base64ImageData) {
                //$log.debug('getPicture : '+ base64ImageData);
                deferred.resolve(base64ImageData);
            }, function(err) {
                // error
                deferred.resolve(error);
            });
            return deferred.promise;
        }

        function findImage(uuid) {
            for(var obj in self.images.data)
                if(self.images.data[obj] && self.images.data[obj].uuid == uuid)
                    return self.images.data[obj];
            return null;
        }
        function getImage(imagePath) {
            var found = findImage(imagePath);
            if(!found) {
                found = {
                    imagePath: imagePath,
                    url: null,
                    error: 'object_not_found',
                }
                self.images.data[imagePath] = found;
            }            
            if(uuid && !found.url && found.error) {
                found.error = null;
                ref.child('images/'+imagePath)
                .getDownloadURL().then(function(url){
                    $log.debug('imagePath',url);
                    found.url = url;
                    EventTrigger.event('loaded-url');
                })
                .catch(function(error) {
                    found.error = error.code;
                    $log.error(error.code,error);
                    switch (error.code) {
                        case 'storage/object_not_found':
                        // File doesn't exist
                        break;

                        case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;

                        case 'storage/canceled':
                        // User canceled the upload
                        break;

                        case 'storage/unknown':
                        // Unknown error occurred, inspect the server response
                        break;
                    }
                });
            }
            return found;

        }
        
        return self;        
}])
;