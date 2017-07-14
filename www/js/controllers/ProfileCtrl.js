
ctrlModule.controller('ProfileCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    // Set Header
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    // Set Ink
    ionicMaterialInk.displayEffect();
});
.service('EventTrigger', function ($log, $rootScope) {
    var self = this;
    self = {
        subscribers: {},    // listener for notification
        add: awaitUpdate,
        event: notifySubscribers,
        isRefreshing: function () { return $rootScope.$root.$$phase; }
    }
    ////////////////////////////////////////////////
    // listener for notification
    ////////////////////////////////////////////////
    function awaitUpdate(key, callback) {
        self.subscribers[key] = callback;
    }
    // distiributer
    function notifySubscribers(notifyKey, param) {
        angular.forEach(self.subscribers,
            function (callback, key) {
                if (notifyKey == key)
                    callback(param);
            });
    }

    return self;
});   
;