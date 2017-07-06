ctrlModule.controller('matchDetailCtrl', function($scope,$ionicHistory,$stateParams,MatchService,Tools,$ionicPopover,$state ) {
    // force back button
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        var histroyBack = $ionicHistory.backView();
        if(histroyBack && histroyBack.stateName == 'app.main.matching' )
            viewData.enableBack = true;        
    });



    var vm = $scope.vm = {};

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
        MatchService.remove(item.key)
        .then(function(){
            $state.go('app.main.matching');
        });
    }    
});