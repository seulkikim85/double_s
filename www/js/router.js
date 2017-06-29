// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter.router', ['ionic'])
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);

    /*
    // Turn off back button text
    $ionicConfigProvider.backButton.previousTitleText(false);
    */

    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.main', {
        url : '/main',
        abstract: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/main.html',
                controller: 'mainCtrl'
            }
        }
    })

// Each tab has its own nav history stack:
 
    .state('app.main.weekly', {
        url: '/weekly',
        views: {
            'weekly-tab': {
                templateUrl: 'templates/tab-weekly.html',
                controller: 'weeklyCtrl'
            }
        }
    })

    .state('app.main.matching', {
        url: '/matching',
        views: {
            'matching-tab': {
                templateUrl: 'templates/tab-matching.html',
                controller: 'matchingCtrl'
            }
        }
    })

    .state('app.palette', {
        url : '/palette',
        views: {
            'menuContent': {
                templateUrl: 'templates/palette.html',
                controller: 'paletteCtrl'
            }
        }
    })    

    .state('app.weeklyDetail', {
        url : '/weeklyDetail',
        views: {
            'menuContent': {
                templateUrl: 'templates/weeklyDetail.html',
                controller: 'weeklyDetailCtrl'
            }
        }
    })
    .state('app.photoUpload', {
        url : '/photoUpload',
        views: {
            'menuContent': {
                templateUrl: 'templates/photoUpload.html',
                controller: 'photoUploadCtrl'
            }
        }
    })


     .state('app.photoUploadCaption', {
        url : '/photoUploadCaption',
        views: {
            'menuContent': {
                templateUrl: 'templates/photoUploadCaption.html',
                controller: 'photoUploadCaptionCtrl'
            }
        }
    })
    .state('app.matchDetail', {
        url : '/matchDetail/:id',
        views: {
            'menuContent': {
                templateUrl: 'templates/matchDetail.html',
                controller: 'matchDetailCtrl'
            },
            params : { id : null } // properties MUST be defined in the to state
        }
    })

    .state('app.intro', {
        url : '/intro',
        views: {
            'menuContent': {
                templateUrl: 'templates/intro.html',
                controller: 'introCtrl'
            }
        }
    })
    .state('app.activity', {
        url: '/activity',
        views: {
            'menuContent': {
                templateUrl: 'templates/activity.html',
                controller: 'ActivityCtrl'
            },
            'fabContent': {
                template: '<button id="fab-activity" class="button button-fab button-fab-top-right expanded button-energized-900 flap"><i class="icon ion-paper-airplane"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-activity').classList.toggle('on');
                    }, 200);
                }
            }
        }
    })

    .state('app.friends', {
        url: '/friends',
        views: {
            'menuContent': {
                templateUrl: 'templates/friends.html',
                controller: 'FriendsCtrl'
            },
            'fabContent': {
                template: '<button id="fab-friends" class="button button-fab button-fab-top-left expanded button-energized-900 spin"><i class="icon ion-chatbubbles"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-friends').classList.toggle('on');
                    }, 900);
                }
            }
        }
    })

    .state('app.gallery', {
        url: '/gallery',
        views: {
            'menuContent': {
                templateUrl: 'templates/gallery.html',
                controller: 'GalleryCtrl'
            },
            'fabContent': {
                template: '<button id="fab-gallery" class="button button-fab button-fab-top-right expanded button-energized-900 drop"><i class="icon ion-heart"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-gallery').classList.toggle('on');
                    }, 600);
                }
            }
        }
    })

    .state('app.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            },
            'fabContent': {
                template: '<button id="fab-profile" class="button button-fab button-fab-bottom-right button-energized-900"><i class="icon ion-plus"></i></button>',
                controller: function ($timeout) {
                    /*$timeout(function () {
                        document.getElementById('fab-profile').classList.toggle('on');
                    }, 800);*/
                }
            }
        }
    })
    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/main/weekly');
});
