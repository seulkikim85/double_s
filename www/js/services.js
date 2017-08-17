function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

angular.module('starter.services', ['ngCordova'])

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
        users: [],
        createUser: createUser,
        login: login,
        logout: logout,
        findUser: findUser,
        myAvatar: null,
        saveMyAvatar: saveMyAvatar,
        loadMyAvatar: loadMyAvatar
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

    function findUser(uuid) {

    }

    function saveMyAvatar(base64img) {
        self.myAvatar = base64img;
        localStorage.setItem("avatar.base64img", base64img);
    }

    function loadMyAvatar() {
        if(self.myAvatar != null)
            return self.myAvatar;
        self.myAvatar = localStorage.getItem("avatar.base64img");
        return self.myAvatar;
    }    
    return self;
}])

//////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////
.factory('MatchService',[ '$q', '$ionicLoading', '$ionicPopup', 'PhotoService', 'EventTrigger','Tools'
,function( $q, $ionicLoading, $ionicPopup, PhotoService, EventTrigger,Tools) {
    var ref = firebase.database().ref('/');

    var self = {
        list: [],
        upload: upload,
        remove: remove, 
        getByKey: function(key) {
            for(var item in self.list)
                if(self.list[item].key == key)
                    return self.list[item];
            return null;
        },
        addComment: addComment,
        toggleLikes: toggleLikes,
        updateContent: updateContent,     
    }

    getAll();


    function getAll() {
        ref.child('matching')
        .on('child_added',function(snap){
        var info = snap.val();
            info.key = snap.key;
            info.avatar = PhotoService.Avatars.get(info.owner); 
            if(info.imageRef1 && !info.imgPath1) {
                firebase.storage().ref(info.imageRef1).getDownloadURL()
                .then(function(url){
                    info.imgPath1 = url;
                    //console.log('image url done',url);
                    EventTrigger.event('loaded-url-matching');
                });
            }
            if(info.imageRef2 && !info.imgPath2) {
                firebase.storage().ref(info.imageRef2).getDownloadURL()
                .then(function(url){
                    info.imgPath2 = url;
                    //console.log('image url done',url);
                    EventTrigger.event('loaded-url-matching');
                });
            }
            info.when = Tools.time_ago(new Date(Math.abs(info.timestamp)));
            self.list.push(info);
        });

        ref.child('matching')
        .on('child_removed',function(oldChildSnapshot){
            console.log('removed',oldChildSnapshot);
            for (var item in self.list)
                if (self.list[item].key == oldChildSnapshot.key) {
                    self.list.splice(item,1);
                    return; 
                }
        });
        ref.child('matching')
        .on('child_changed',function(oldChildSnapshot,snapkey){
            console.log('changed:'+oldChildSnapshot.key,oldChildSnapshot.val());
            var newOne = oldChildSnapshot.val();
            var find = self.getByKey(oldChildSnapshot.key);
            if(find) {
                // console.log('replace1',find);
                find.comments = newOne.comments;
                if(newOne.i1 == undefined)
                    newOne.i1 = {likeCount:0}
                find.i1 = newOne.i1;
                if(newOne.i2 == undefined)
                    newOne.i2 = {likeCount:0}
                find.i2 = newOne.i2;
                // console.log('replace1',find);
                EventTrigger.event('changed-comments',find);
            }
        });
        
    }

    function upload(base64img1,base64img2, form) {

         var deferred = $q.defer();

        form.imageRef1 = '/images/matching/'+guid()+'.jpg';
        form.imageRef2 = '/images/matching/'+guid()+'.jpg';

        $ionicLoading.show('Image uploading..')
        PhotoService.UpdateImageFromBase64(form.imageRef1,base64img1.split(',')[1])
        .then(function(){
            PhotoService.UpdateImageFromBase64(form.imageRef2,base64img2.split(',')[1])
            .then(function(){
                $ionicLoading.hide();

                $ionicLoading.show('Saving...');
                var ref = firebase.database().ref('/');
                ref.child("matching").push().set(form)
                .then(function(){
                    console.log('save complete');
                    $ionicLoading.hide();
                    deferred.resolve();
                });

            });
        });
        return deferred.promise;

    }

    function updateContent(key,edit) {
        var deferred = $q.defer();
        $ionicLoading.show('updating...');

        var updates = {};
        // Update push_id
        updates['matching/'+key+'/title'] = edit.title;
        updates['matching/'+key+'/caption'] = edit.caption;
        ref.update(updates).then(function(){
            console.log('update complete');
            $ionicLoading.hide();
            deferred.resolve();
        });
        return deferred.promise;
    }
    
     function remove(key) {
        var deferred = $q.defer();
        $ionicLoading.show('deleting...');
        var ref = firebase.database().ref('/');
        ref.child("matching").child(key).remove()
        .then(function(){
            console.log('remove complete');
            $ionicLoading.hide();
            deferred.resolve();
        });
        return deferred.promise;
    }

    function addComment(key, commentInfo) {
        ref.child("matching").child(key + '/comments').push().set(commentInfo)
            .then(function () {
                console.log('save complete', key, commentInfo);
            });

    }

      function toggleLikes(no,key,uid) {
        ref.child("matching").child(key).transaction(function (post) {
            if (post) {
                if(!post.i1)
                    post.i1 = { likes:[]};
                if(!post.i2)
                    post.i2 = { likes:[]};

                item = (no == '1')? post.i1 : post.i2;
                
                if (item.likes && item.likes[uid]) {
                    item.likeCount--;
                    item.likes[uid] = null;
                } else {
                    if(item.likeCount == undefined)
                        item.likeCount = 0;
                    item.likeCount++;
                    if (item.likes == undefined) {
                        item.likes = {};
                    }
                    item.likes[uid] = true;
                }
            }
            return post;
        });
      }
    return self;

}])
//////////////////////////////////////////////////////////////////////////////////////////////////////
.factory('WeeklyService',[ '$q', '$ionicLoading', '$ionicPopup','PhotoService','EventTrigger','Tools'
,function( $q, $ionicLoading, $ionicPopup,PhotoService,EventTrigger,Tools) {
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
        },
        addComment: addComment,
        toggleLikes: toggleLikes,
        updateContent: updateContent,     
    }

    getAll();


    function refactory(key,val,callback) {
        var info = val;
        info.key = key;
        info.when = Tools.time_ago(new Date(Math.abs(val.timestamp)));

        if(info.imageRef && !info.imgPath) {
            firebase.storage().ref(info.imageRef).getDownloadURL()
            .then(function(url){
                info.imgPath = url;
                callback(url);
            });
        }
        return info;
    }
    function getAll() {
        ref.child('weekly')
        .on('child_added',function(snap){
            //console.log('weekly item',info);
            var info = refactory(snap.key,snap.val(),function(url){
                //console.log('image url done',url);
                EventTrigger.event('loaded-url-weekly');
            });
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
        ref.child('weekly')
        .on('child_changed',function(oldChildSnapshot,snapkey){
            console.log('changed:'+oldChildSnapshot.key,oldChildSnapshot.val());
            var newOne = oldChildSnapshot.val();
            var find = self.getByKey(oldChildSnapshot.key);
            if(find) {
                // console.log('replace1',find);
                find.comments = newOne.comments;
                find.likeCount = newOne.likeCount;
                // console.log('replace1',find);
                EventTrigger.event('changed-comments',find);
            }
        });
    }

    function upload(base64img, form) {
        var deferred = $q.defer();

        form.imageRef = '/images/weekly/'+guid()+'.jpg';

        $ionicLoading.show('Image uploading..')
        PhotoService.UpdateImageFromBase64(form.imageRef,base64img.split(',')[1])
        .then(function(){
            $ionicLoading.hide();

            $ionicLoading.show('Saving...');
            ref.child("weekly").push().set(form)
            .then(function(){
                console.log('save complete');
                $ionicLoading.hide();
                deferred.resolve();
            });

        });
        
        return deferred.promise;
    }

    function updateContent(key,edit) {
        var deferred = $q.defer();
        $ionicLoading.show('updating...');

        var updates = {};
        // Update push_id
        updates['weekly/'+key+'/title'] = edit.title;
        updates['weekly/'+key+'/caption'] = edit.caption;
        ref.update(updates).then(function(){
            console.log('update complete');
            $ionicLoading.hide();
            deferred.resolve();
        });
        return deferred.promise;
    }

    function remove(key) {
        var deferred = $q.defer();
        $ionicLoading.show('deleting...');
        ref.child("weekly").child(key).remove()
        .then(function(){
            console.log('remove complete');
            $ionicLoading.hide();
            deferred.resolve();
        });
        return deferred.promise;
    }
    
    function addComment(key, commentInfo) {
        ref.child("weekly").child(key+'/comments').push().set(commentInfo)
        .then(function(){
            console.log('save complete',key,commentInfo);
        });

    }
    function toggleLikes(key,uid) {
        console.log("toggle likes",key,uid);
        ref.child("weekly").child(key).transaction(function (post) {
            if (post) {
                if (post.likes && post.likes[uid]) {
                    post.likeCount--;
                    post.likes[uid] = null;
                } else {
                    if(post.likeCount == undefined)
                        post.likeCount = 0;
                    post.likeCount++;
                    if (!post.likes) {
                        post.likes = {};
                    }
                    post.likes[uid] = true;
                }
            }
            return post;
        });
    }    

    return self;
}])

//////////////////////////////////////////////////////////////////////////////////////////////////////
.factory('PhotoService',[ '$log','$q', '$cordovaCamera','$ionicLoading','EventTrigger'

//////////////////////////////////////////////////////////////////////////////////////////////////////
,function PhotoService ($log, $q,  $cordovaCamera, $ionicLoading,EventTrigger) {
        var self = {};

        angular.extend(self,{
            images: {
                data: {},
                get: getImage,
            },
            Avatars: {
                data: {},
                get: getAvatar,
                put: putAvatar,
            },
            takeImage: takeImage,
            UpdateImageFromBase64: UploadImageBase64,
            LoadOrientationImage: LoadOrientationImage,
        });

        // load profile image from server
        var ref = firebase.storage().ref('/');
        
        function UploadImage(refPath,file) {
            var deferred = $q.defer();
            if(UserService.getProfile()) {
                var task = ref.child(refPath)
                .put(file);

                UploadTaskProgress(task).then(function(downloadURL){
                    deferred.resolve(downloadURL);
                });
            }
            return deferred.promise;
        }

        function UploadImageBase64(refPath,imageBase64) {
            var deferred = $q.defer();
            var task = ref.child(refPath)
            .putString(imageBase64,'base64', {contentType:'image/jpg'});

            UploadTaskProgress(task).then(function(downloadURL){
                deferred.resolve(downloadURL);
            });
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
        // example
        // PhotoService.LoadOrientationImage(file, function (base64img, value) {
        //     $('#placeholder1').attr('src', base64img);
        //     console.log(rotation[value]);
        //     var rotated = $('#placeholder2').attr('src', base64img);
        //     if (value) {
        //         rotated.css('transform', rotation[value]);
        //     }
        // });  
        var rotation = {
            1: 'rotate(0deg)',
            3: 'rotate(180deg)',
            6: 'rotate(90deg)',
            8: 'rotate(270deg)'
        };        

        function _arrayBufferToBase64(buffer) {
            var binary = ''
            var bytes = new Uint8Array(buffer)
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i])
            }
            return window.btoa(binary);
        }

        function LoadOrientationImage(file, callback) {
            var fileReader = new FileReader();
            fileReader.onloadend = function () {
                var base64img = "data:" + file.type + ";base64," + _arrayBufferToBase64(fileReader.result);
                var scanner = new DataView(fileReader.result);
                var idx = 0;
                var value = 1; // Non-rotated is the default
                if (fileReader.result.length < 2 || scanner.getUint16(idx) != 0xFFD8) {
                    // Not a JPEG
                    if (callback) {
                        callback(base64img, value);
                    }
                    return;
                }
                idx += 2;
                var maxBytes = scanner.byteLength;
                while (idx < maxBytes - 2) {
                    var uint16 = scanner.getUint16(idx);
                    idx += 2;
                    switch (uint16) {
                        case 0xFFE1: // Start of EXIF
                            var exifLength = scanner.getUint16(idx);
                            maxBytes = exifLength - idx;
                            idx += 2;
                            break;
                        case 0x0112: // Orientation tag
                            // Read the value, its 6 bytes further out
                            // See page 102 at the following URL
                            // http://www.kodak.com/global/plugins/acrobat/en/service/digCam/exifStandard2.pdf
                            value = scanner.getUint16(idx + 6, false);
                            maxBytes = 0; // Stop scanning
                            break;
                    }
                }
                if (callback) {
                    callback(base64img, value);
                }
            }
            fileReader.readAsArrayBuffer(file);
        }

        function putAvatar(uuid, base64img) {
            $ionicLoading.show('Image uploading..')
            self.UpdateImageFromBase64('users/'+uuid+'/profile.jpg',base64img.split(',')[1])
            .then(function(){
                $ionicLoading.hide();
            });
        }
        function findAvatar(uuid) {
            for(var obj in self.Avatars.data)
                if(self.Avatars.data[obj] && self.Avatars.data[obj].uuid == uuid)
                    return self.Avatars.data[obj];
            return null;
        }
        function getAvatar(uuid) {
            var found = findAvatar(uuid);
            if(!found) {
                found = {
                    uuid: uuid,
                    url: null,
                    error: null,
                }
                self.Avatars.data[uuid] = found;
            }            
            if(uuid && !found.url && found.error === null) {
                console.log('query avatar',found);
                found.error = '';
                ref.child('users/'+uuid+'/profile.jpg')
                .getDownloadURL().then(function(url){
                    $log.debug('uuid',url);
                    found.url = url;
                    EventTrigger.event('loaded-url',url);
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
        },
        resetOrientation: function(srcBase64, srcOrientation, callback) {
            var img = new Image();    

            img.onload = function() {
                var width = img.width,
                    height = img.height,
                    canvas = document.createElement('canvas'),
                    ctx = canvas.getContext("2d");

                // set proper canvas dimensions before transform & export
                if ([5,6,7,8].indexOf(srcOrientation) > -1) {
                canvas.width = height;
                canvas.height = width;
                } else {
                canvas.width = width;
                canvas.height = height;
                }

                // transform context before drawing image
                switch (srcOrientation) {
                case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
                case 3: ctx.transform(-1, 0, 0, -1, width, height ); break;
                case 4: ctx.transform(1, 0, 0, -1, 0, height ); break;
                case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
                case 6: ctx.transform(0, 1, -1, 0, height , 0); break;
                case 7: ctx.transform(0, -1, -1, 0, height , width); break;
                case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
                default: ctx.transform(1, 0, 0, 1, 0, 0);
                }

                // draw image
                ctx.drawImage(img, 0, 0);

                // export base64
                callback(canvas.toDataURL());
            };

            img.src = srcBase64;
        }
    }
})
.service('EventTrigger', function ($log, $rootScope) {
    var self = this;
    self = {
        subscribers: {},    // listener for notification
        add: awaitUpdate,
        event: notifySubscribers,
        isRefreshing: function () { return $rootScope.$root.$$phase; }
    }
    ////////////////////////////////////////////////
    // listener for notification
    ////////////////////////////////////////////////
    function awaitUpdate(key, callback) {
        self.subscribers[key] = callback;
    }
    // distiributer
    function notifySubscribers(notifyKey, param) {
        angular.forEach(self.subscribers,
            function (callback, key) {
                if (notifyKey == key)
                    callback(param);
            });
    }

    return self;
});   
;