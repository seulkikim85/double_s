ctrlModule.controller('matchDetailCtrl', function($scope,$ionicHistory,$stateParams,MatchService,Tools ) {
    // force back button
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        var histroyBack = $ionicHistory.backView();
        if(histroyBack && histroyBack.stateName == 'app.main.matching' )
            viewData.enableBack = true;        
    });



    var vm = $scope.vm = {};

    // vm.avatar =  'https://firebasestorage.googleapis.com/v0/b/capstone-project-a56d3.appspot.com/o/face.jpg?alt=media&token=260d326c-0b63-4eaf-9a31-897ab5747f39';
    // vm.photo = 'https://firebasestorage.googleapis.com/v0/b/capstone-project-a56d3.appspot.com/o/bag.jpg?alt=media&token=ab5039c3-3aeb-451a-9d3d-b12d379f99fa';
    // vm.writter = 'Sansa Stark';
    // vm.likes = 6;
    // vm.comments = 5;
    // vm.timestamp =  Date.now();
    // vm.p = "https://firebasestorage.googleapis.com/v0/b/capstone-project-a56d3.appspot.com/o/bag.jpg?alt=media&token=ab5039c3-3aeb-451a-9d3d-b12d379f99fa";

    $scope.$on('$ionicView.afterEnter', function (event, viewData) {
        var info = MatchService.getByKey($stateParams.id);  
        if(null != info) {
            vm.imgPath1 = info.imgPath1;
            vm.imgPath2 = info.imgPath2;
            vm.avatar = info.avatar;
            vm.writter = info.writter;
            vm.caption = info.caption;
            vm.title = info.title;
            vm.likes = info.likes;
            vm.key = info.key;
            vm.when = Tools.time_ago(new Date(Math.abs(info.timestamp)));
            console.log('enter',vm);
            $scope.$apply();
        }
    });     
});