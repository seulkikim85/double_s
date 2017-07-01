
ctrlModule.controller('weeklyDetailCtrl', function($scope,$ionicHistory,$stateParams,WeeklyService, Tools) {

    var vm = $scope.vm = {};
    // force back button
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        var histroyBack = $ionicHistory.backView();
        if(histroyBack && histroyBack.stateName == 'app.main.weekly' )
            viewData.enableBack = true;   

        vm.avatar =  'img/avatar/blank.png';
        vm.imgPath = 'img/mannequin.jpg';
        vm.caption = 'She look so nice style and also ...';
        vm.writter = 'Sansa Stark';
        vm.likes = 0;
        vm.comments = [
            {
                avatar: 'img/avatar/blank.png',
                writter: 'John Snow',
                caption: 'Da illest illegitimate',
                when: Tools.time_ago(Date.now())
            },
            {
                avatar: 'img/avatar/blank.png',
                writter: 'John Snow',
                caption: 'Da illest illegitimate',
                when: Tools.time_ago(Date.now())
            },
            {
                avatar: 'img/avatar/blank.png',
                writter: 'John Snow',
                caption: 'Da illest illegitimate',
                when: Tools.time_ago(Date.now())
            }
        ];
        vm.when = Tools.time_ago(Date.now());

        console.log('enter',vm);
    });
    
    $scope.$on('$ionicView.afterEnter', function (event, viewData) {
        var info = WeeklyService.getByKey($stateParams.id);  
        if(null != info) {
            vm.imgPath = info.imgPath;
            vm.avatar = info.avatar;
            vm.writter = info.writter;
            vm.caption = info.caption;
            vm.title = info.title;
            vm.likes = info.likes;
            vm.when = Tools.time_ago(new Date(Math.abs(info.timestamp)));
            console.log('enter',vm);
            $scope.$apply();
        }
    });    

});