var app = angular.module("myTranslatorApp", ['ngRoute', 'angular.filter']);
app.config(['$routeProvider',
    function ($routeProvider, $filter) {
        $routeProvider
            .when('/home', {
                templateUrl: 'templates/home.html',
                controller: 'homeCtrl'
            })
            .when('/text', {
                templateUrl: 'templates/translate-text.html',
                controller: 'TranslateCtrl'
            })
            .when('/webpage', {
                templateUrl: 'templates/translate-website.html',
                controller: 'WebCtrl'
            })
            .when('/document', {
                templateUrl: 'templates/translate-document.html',
                controller: 'DocumentCtrl'
            })
            .when('/key', {
                templateUrl: 'templates/key.html',
                controller: 'homeCtrl'
            })
            .otherwise({
                redirectTo: '/home'
            });
    }
]);