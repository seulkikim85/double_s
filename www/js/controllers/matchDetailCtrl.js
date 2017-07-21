ctrlModule.controller('matchDetailCtrl', function($scope,$rootScope,$ionicHistory,$timeout,$ionicScrollDelegate,
    $stateParams,MatchService,Tools,$ionicPopover,$state ,EventTrigger, PhotoService ) {
    
    var vm = $scope.vm = {
        info: {}
    };

    // force back button
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        var histroyBack = $ionicHistory.backView();
        if(histroyBack && histroyBack.stateName == 'app.main.matching' )
            viewData.enableBack = true;        

        vm.count_comments = function() {
            if(!vm.info.comments)
                return 0;
            return Object.keys(vm.info.comments).length;
        }
        vm.sendComment = function(comment) {
             if(!$scope.$parent.isLogined()) {
                $ionicPopup.alert({
                    title: 'Member Only',
                    template: 'You need to login'
                });
                return;
            }
            var newComment = {
                uuid: $rootScope.currentUser.uid,
                writter: $rootScope.currentUser.email,
                caption: comment,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            }           
            console.log('send comment'); 
            MatchService.addComment(vm.info.key,newComment);
            vm.newComment = '';
            $timeout(function() {
                 $ionicScrollDelegate.scrollBottom();
            },100);
        }
        vm.ConvertComment= function(val) {
            val.avatar = PhotoService.Avatars.get(val.uuid);
            val.when = Tools.time_ago(new Date(Math.abs(val.timestamp)));
            return val;
        }       
        console.log('before enter',vm); 

        vm.toggleLikes = function (key) {
        if(!CheckLogin())
            return;        
        WeeklyService.toggleLikes(key,$rootScope.currentUser.uid);
    }
    function CheckLogin() {
        if(!$rootScope.currentUser) {
            $ionicPopup.alert({
                title: 'Required Authentication!!',
                template: 'Log in Please!!'
            });
            return false;
        }
        return true;
    }

    
    });



    $scope.$on('$ionicView.afterEnter', function (event, viewData) {
        var info = MatchService.getByKey($stateParams.id);  
        if(null != info) {
            vm.info = info;
            console.log('after enter',vm);
            if(!EventTrigger.isRefreshing())
                $scope.$apply();
        }
    }); 
    EventTrigger.add('changed-comments',function(info){
        vm.info = info;
        if(!EventTrigger.isRefreshing())
            $scope.$apply();
        }
    );     

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
        firebase.database().ref('/matching').child(item.info.key+'/comments').remove();
    }
    $scope.delete = function(item) {
        console.log("delete !!",item);
        MatchService.remove(item.info.key)
        .then(function(){
            $state.go('app.main.matching');
        });
    }    
});