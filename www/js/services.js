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
        upload: upload,
        remove: remove, 
        getByKey: function(key) {
            for(var item in self.list_left)
                if(self.list_left[item].key == key)
                    return self.list_left[item];
            for(var item in self.list_right)
                if(self.list_right[item].key == key)
                    return self.list_right[item];
            return null;
        }        
    }

    getAll();


    function getAll() {
        ref.child('weekly')
        .on('child_added',function(snap){
            var info = snap.val();
            info.key = snap.key;
            console.log('weekly item',info);
            if(self.list_left.length > self.list_right.length)
                self.list_right.push(info);
            else
                self.list_left.push(info);
        });
        ref.child('weekly')
        .on('child_removed',function(oldChildSnapshot){
            for (var item in self.list_left)
                if (self.list_left[item].key == oldChildSnapshot.key) {
                    self.list_left.splice(item,1);
                    return; 
                }
            for (var item in self.list_right)
                if (self.list_right[item].key == oldChildSnapshot.key) {
                    self.list_right.splice(item,1);
                    return; 
                }
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

    function remove(key) {
        var deferred = $q.defer();
        $ionicLoading.show('deleting...');
        var ref = firebase.database().ref('/');
        ref.child("weekly").child(key).remove()
        .then(function(){
            console.log('remove complete');
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

.factory('Tools',function(){
    return {
        time_ago: function(time) {

        switch (typeof time) {
            case 'number':
                break;
            case 'string':
                time = +new Date(time);
                break;
            case 'object':
                if (time.constructor === Date) time = time.getTime();
                break;
            default:
                time = +new Date();
        }
        var time_formats = [
            [60, 'seconds', 1], // 60
            [120, '1 minute ago', '1 minute from now'], // 60*2
            [3600, 'minutes', 60], // 60*60, 60
            [7200, '1 hour ago', '1 hour from now'], // 60*60*2
            [86400, 'hours', 3600], // 60*60*24, 60*60
            [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
            [604800, 'days', 86400], // 60*60*24*7, 60*60*24
            [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
            [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
            [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
            [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
            [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
            [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
            [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
            [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
        ];
        var seconds = (+new Date() - time) / 1000,
            token = 'ago',
            list_choice = 1;

        if (seconds == 0) {
            return 'Just now'
        }
        if (seconds < 0) {
            seconds = Math.abs(seconds);
            token = 'from now';
            list_choice = 2;
        }
        var i = 0,
            format;
        while (format = time_formats[i++])
            if (seconds < format[0]) {
            if (typeof format[2] == 'string')
                return format[list_choice];
            else
                return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
            }
        return time;
        }    
    }
})
;