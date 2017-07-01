ctrlModule.controller('mainCtrl',function($scope,$state) {
    $scope.clickLink = function(next) {
        console.log('Click',next);
        $state.go(next);
    }

    $scope.isMain = function() {
        if($state.current.name == 'app.main.weekly' ||
            $state.current.name == 'app.main.matching' )
            return true;

        return false;
    }
});