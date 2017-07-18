ctrlModule.controller('matchDetailCtrl', function($scope,$rootScope,$ionicHistory,$stateParams,MatchService,Tools,$ionicPopover,$state, $WeeklyService,$Tools,$EventTrigger ) {
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

              vm.count_comments = function() {
            if(!vm.info.comments)
                return 0;
            return Object.keys(vm.info.comments).length;
        }
        vm.sendComment = function(comment) {
            var newComment = {
                uuid: $rootScope.currentUser.uid,
                writter: $rootScope.currentUser.email,
                caption: comment,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            }            
            MatchService.addComment(vm.info.key,newComment);
        }
        vm.ConvertComment= function(val) {
            val.when = Tools.time_ago(new Date(Math.abs(val.timestamp)));
            return val;
        }

        console.log('before enter',vm);
    };

    $scope.$on('$ionicView.afterEnter', function (event, viewData) {
        var info = MatchService.getByKey($stateParams.id);  
        if(null != info) {
            vm.info = info;
            console.log('after enter',vm);
            $scope.$apply();
        }
    }); 
    EventTrigger.add('changed-comments',function(info){
        vm.info = info;
        if(!EventTrigger.isRefreshing())
            $scope.$apply();
    
            console.log('enter',vm);
            $scope.$apply();
        }
    );     

	 ////////////////////////////////////////////////////////////
	$ionicPopover.fromTemplateUrl('templates/Match_popover.html', {
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