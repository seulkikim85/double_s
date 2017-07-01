ctrlModule.controller('matchingCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, $ionicLoading, $rootScope) {
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
    

});