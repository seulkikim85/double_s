
ctrlModule.controller('weeklyDetailCtrl', function($scope,$state,$rootScope,$ionicHistory,$stateParams,$ionicPopover,WeeklyService, Tools,EventTrigger) {

    var vm = $scope.vm = {
        info: {}
    };
    // force back button
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        var histroyBack = $ionicHistory.backView();
        if(histroyBack && histroyBack.stateName == 'app.main.weekly' )
            viewData.enableBack = true;   

        vm.info.avatar =  'img/avatar/blank.png';
        vm.info.imgPath = 'img/mannequin.jpg';
        vm.info.caption = 'She look so nice style and also ...';
        vm.info.writter = 'Sansa Stark';
        vm.info.likes = 0;
        vm.info.when = Tools.time_ago(Date.now());
        

        vm.count_comments = function() {
            if(!vm.info.comments)
                return 0;
            return Object.keys(vm.info.comments).length;
        }
        vm.sendComment = function(comment) {
            var newComment = {
                uuid: $rootScope.currentUser.uid,
                caption: comment,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            }            
            WeeklyService.addComment(vm.info.key,newComment);
        }
        vm.ConvertComment= function(val) {
            val.writter = val.uuid; 
            val.when = Tools.time_ago(new Date(Math.abs(val.timestamp)));
            return val;
        }

        console.log('before enter',vm);
    });

    $scope.$on('$ionicView.afterEnter', function (event, viewData) {
        var info = WeeklyService.getByKey($stateParams.id);  
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

    $scope.reset = function (item) {
        console.log("modify !!",item);
        firebase.database().ref('/weekly').child(item.info.key+'/comments').remove();
    }
    $scope.delete = function(item) {
        console.log("delete !!",item);
        WeeklyService.remove(item.key)
        .then(function(){
            $state.go('app.main.weekly');
        });
    }
});