
ctrlModule.controller('weeklyDetailCtrl', function($scope,$state,$ionicHistory,$stateParams,$ionicPopover,WeeklyService, Tools) {

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
            vm.key = info.key;
            vm.when = Tools.time_ago(new Date(Math.abs(info.timestamp)));
            console.log('enter',vm);
            $scope.$apply();
        }
    }); 

	 ////////////////////////////////////////////////////////////
	$ionicPopover.fromTemplateUrl('templates/weekly_popover.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(popover) {
		$scope.popover = popover;
	});

	$scope.openPopover = function($event, item) {
		$scope.popdata = { 'item': item };
		$scope.popover.show($event);
	}

    $scope.closePopover = function () {
        $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
		console.log("destroy popover!!");
        $scope.popover.remove();
    });    

    $scope.delete = function(item) {
        console.log("delete !!",item);
        WeeklyService.remove(item.key)
        .then(function(){
            $state.go('app.main.weekly');
        });
    }
});