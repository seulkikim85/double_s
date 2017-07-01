matchDetailCtrl.controller('matchDetailCtrl', function($scope,$ionicHistory) {
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
    
});