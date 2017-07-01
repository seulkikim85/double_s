angular.module('starter.directives', [])
.directive('fileChange', function() {
    return {
     restrict: 'A',
     scope: {
       handler: '&'
     },
     link: function (scope, element) {
      element.on('change', function (event) {
        scope.$apply(function(){
          scope.handler({files: event.target.files});
        });
      });
     }
    }
})

.directive('comment', [function ($log, $compile) {
  console.debug('comment link');
  var objLink = {
    scope: {
      data: '=comment'
    },
    templateUrl: 'templates/comment-line.html',
    transclude: true,
    controller: function ($scope, $state, $ionicHistory, $location ) {

      var vm = $scope.vm = {};

      vm.clickComment = function (param) {
        // move next state
        if ($scope.data.state) {
        //   var param = {};
        //   switch($scope.data.type) {
        //     case 'card-view':
        //       param.hash = $scope.data.$$hashKey;
        //       break;
        //   }
        //   $scope.$parent.go($scope.data.state,param);
        }
      }

    }
  }

  return objLink;
}])